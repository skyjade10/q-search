import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { searchProducts } from "./services/searchService.js";



const app = express();
app.use(cors());
app.use(express.json());

// Rate limiter: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/search', limiter);

app.post("/search", async (req, res) => {
  try {
    const { query, category } = req.body;
    console.log("request:", { requestBody: req.body });
    console.log("Received search request:", { query, category });

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const result = await searchProducts(query, category);

    res.json({
      success: true,
      count: Array.isArray(result.data) ? result.data.length : 0,
      category: result.category,
      data: result.data
    });

  } catch (err) {
    console.error("SERVER ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});