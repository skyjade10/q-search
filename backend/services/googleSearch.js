import axios from "axios";

export const googleSearch = async (query) => {
  const res = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: query,
      api_key: process.env.SERPAPI_KEY
    }
  });

return res.data.organic_results
    .filter(result => !result.link.includes("youtube.com"))
    .map(result => result.link)
    .sort((a, b) => {
      if (a.includes("amazon.com")) return -1;
      if (b.includes("amazon.com")) return 1;
      return 0;
    });
}