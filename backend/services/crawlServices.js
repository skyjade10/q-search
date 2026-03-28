import { tinyfishSearch } from "./tinyfishClient.js";

export const runSearchQueries = async (queries) => {
  let urls = [];

  for (let query of queries) {
    const results = await tinyfishSearch(query);
    urls.push(...results);
  }

  // remove duplicates
  return [...new Set(urls)];
}