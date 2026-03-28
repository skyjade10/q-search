import { runTinyFish, runTinyFishStream } from "./tinyfishClient.js";
import { googleSearch } from "./googleSearch.js";
import { buildSearchGoal, buildExtractionGoal, extractUrls, parseSSE, cleanResults, rankProducts, safeJSONParse } from "../utils/searchUtils.js";  

const getCategoryFromQuery = (query, categoryFromUser) => {
  const q = (query || '').toLowerCase();

  if (q.includes('hotel')) return 'hotel';
  if (q.includes('house') || q.includes('home') || q.includes('rent')) return 'house';
  if (q.includes('flight') || q.includes('airline') || q.includes('plane')) return 'flight';
  if (q.includes('food') || q.includes('restaurant') || q.includes('meal')) return 'food';
  if (q.includes('clothing') || q.includes('apparel') || q.includes('shirt') || q.includes('pants') || q.includes('shoes')) return 'clothing';
  if (q.includes('electronic') || q.includes('laptop') || q.includes('phone') || q.includes('headphone') || q.includes('camera')) return 'electronics';

  return categoryFromUser || 'electronics';
};

export const searchProducts = async (query,categoryFromUser) => {
  const categoryFromQuery = getCategoryFromQuery(query,categoryFromUser);

  const urlsResult = await googleSearch(query);
  console.log('TinyFish search url result', urlsResult);

  const urls = extractUrls(urlsResult);
  console.log('extracted urls', urls.slice(0, 3));

  let products = [];

  if (urls.length > 0) {
    const MAX_URLS = 3;
    const extractionTasks = urls.slice(0, MAX_URLS).map(async (url) => {
      try {
         const stream = await runTinyFishStream(url, buildExtractionGoal(query, categoryFromQuery));
         if (!stream) return null;

         const parsedStream = await parseSSE(stream);
         return safeJSONParse(parsedStream);
      } catch (err) {
        console.error(`Extraction failed for ${url}:`, err?.message || err);
        return null;
      }
    });

    const extractionResults = await Promise.allSettled(extractionTasks);
    const results = extractionResults
      .filter((item) => item.status === 'fulfilled')
      .map((item) => item.value)
      .filter(Boolean);

    console.log('results search services', results);
    products = cleanResults(results);
  }

  const productsWithCategory = products.map((item) => ({
    ...item,
    category: categoryFromQuery,
    id: item.id || `${categoryFromQuery}-${item.name?.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`,
  }));

  return {
    category: categoryFromQuery,
    data: productsWithCategory,
  };
};