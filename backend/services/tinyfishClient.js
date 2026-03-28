import dotenv from "dotenv";
import { parseSSE } from "../utils/searchUtils.js";
dotenv.config();

const RUN_URL = "https://agent.tinyfish.ai/v1/automation/run";
const SSE_URL = "https://agent.tinyfish.ai/v1/automation/run-sse";
const API_KEY = process.env.TINYFISH_API_KEY 

// SSE (streaming)
export const runTinyFishStream = async (url, goal) => {
  try {
    console.log("Running TinyFish stream on:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // 90s

    const response = await fetch(SSE_URL, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        url,
        goal,
        stream: true,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`TinyFish SSE request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("TinyFish SSE response has no body stream");
    }

    return response.body;
  } catch (err) {
    console.error("TinyFishStream FAILED:", err.name, err.message);
    return null;
  }
}


// STANDARD RUN (structured)
export const runTinyFish = async (url, goal) => {
  try {
    console.log("Running TinyFish (JSON) on:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // 90s

    const res = await fetch(RUN_URL, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        url,
        goal,
        stream: false,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`TinyFish request failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("data", data);

    return data.result || [];
  } catch (err) {
    console.error("TinyFish FAILED:", err?.name, err?.message || err);
    return [];
  }
}

