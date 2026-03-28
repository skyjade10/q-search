import { tinyfishOpen, tinyfishExtract } from "./tinyfishClient.js";

export const extractProductData = async (url) => {
  try {
    const page = await tinyfishOpen(url);

    if (!page) return null;

    const data = await tinyfishExtract(page);

    if (!data || !data.name || !data.price) return null;

    return {
      name: data.name,
      price: data.price,
      currency: data.currency || "USD",
      shipping: data.shipping || "Unknown",
      availability: data.availability || "Unknown",
      url
    };

  } catch (err) {
    console.error("Error extracting:", url);
    return null;
  }
}