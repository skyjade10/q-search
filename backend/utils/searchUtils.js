
export const buildSearchGoal = (query) => {
  return `
    Go to Google search.

    Search for: "${query}"

    Extract the top 3 organic result URLs only.

    Return ONLY JSON:
    [
    "url1",
    "url2",
    "url3"
    ]

    No explanation.
    No other text.
    `;
}

export const cleanResults = (results) => {
  let all = [];

  for (let r of results) {
    if (!r) continue;

    try {
      const parsed = typeof r === "string" ? JSON.parse(r) : r;

      if (Array.isArray(parsed)) {
        all.push(...parsed);
      }

    } catch(err) {
        console.error("Result parsing failed:", err.message);
      continue;
    }
  }

  console.log("cleaned results", all);

  return all.filter(p => p.name && p.price);
}

export const extractUrls = (result) => {
  try {
    console.log("extractUrls Extracting URLs from:", result);
    if (!result) return [];

    const parsed =
      typeof result === "string" ? JSON.parse(result) : result;

    if (Array.isArray(parsed)) {
      return parsed.filter(url => typeof url === "string");
    }

    return [];

  } catch (err) {
    console.error("URL extraction failed:", err.message);
    return [];
  }
}

export const buildExtractionGoal = (query, category) => {
  return `
    You are a structured data extraction system.

    Task:
    Extract up to 5 results matching the user's query and intent.

    USER QUERY:
    "${query}"

    OPTIONAL CATEGORY PROVIDED:
    "${category || "all"}"

    ---

    CATEGORY RESOLUTION RULES

    1. If a category is provided → use it.
    2. Otherwise if category is all infer the BEST category from the query.
    3. Valid categories:

    * general
    * electronics
    * food
    * clothing
    * hotel
    * house
    * flight

    4. If no clear category exists → default to "general".

    Return the resolved category as:
    "category": "<resolved-category>"

    ---

    INTENT MATCHING

    Only extract results matching the user's intent.

    Example:
    Query: "blue wireless headphones under 100 dollars"
    → Must be:

    * headphones
    * wireless
    * preferably blue
    * price under budget

    If price is missing:

    * include item
    * apply score penalty internally

    Ignore:

    * menus
    * headers
    * ads
    * unrelated text
    * navigation content

    If no results exist → return [].

    ---

    CATEGORY SCHEMAS

    Return ONLY fields relevant to the resolved category.

    ### electronics / food / clothing (GENERAL PRODUCTS)

    {
    "id": "generate using url+name if missing",
    "name": "",
    "price": number,
    "currency": "",
    "rating": number,
    "availability": "",
    "description": "",
    "tags": [""],
    "image": "",
    "url": ""
    }

    ### hotel

    {
    "id": "",
    "name": "",
    "price": number,
    "currency": "",
    "rating": number,
    "location": "",
    "freeWifi": boolean,
    "breakfast": boolean,
    "safeArea": boolean,
    "reviews": number,
    "image": "",
    "url": ""
    }

    ### house

    {
    "id": "",
    "name": "",
    "price": number,
    "currency": "",
    "location": "",
    "bedrooms": number,
    "bathrooms": number,
    "parking": boolean,
    "solar": boolean,
    "reliableWater": boolean,
    "secureYard": boolean,
    "image": "",
    "url": ""
    }

    ### flight

    {
    "id": "",
    "name": "",
    "price": number,
    "currency": "",
    "airline": "",
    "flightNumber": "",
    "departureTime": "",
    "departureAirport": "",
    "arrivalTime": "",
    "arrivalAirport": "",
    "duration": "",
    "type": "",
    "bagIncluded": boolean,
    "fastest": boolean,
    "onTime": boolean,
    "image": "",
    "url": ""
    }

    ---

    OUTPUT FORMAT (STRICT)

    Return ONLY JSON:

    {
    "category": "",
    "results": [ ... ]
    }

    No explanations.
    No markdown.
    No extra text.

  `;
}

export const rankProducts = (products, budget) => {
  return products
    .map(p => {
      let score = 0;

      // Budget scoring
      if (budget && p.price) {
        if (p.price <= budget) score += 50;
        else score -= 20;
      }

      //Shipping bonus
      if (p.shipping !== null && p.shipping !== undefined && p.shipping.toLowerCase().includes("free")) {
        score += 20;
      }

      //Availability
      if (p.availability !== null && p.availability !== undefined && p.availability.toLowerCase().includes("in stock")) {
        score += 10;
      }

      console.log(`Product: ${p.name}, Price: ${p.price}, Score: ${score}`);
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score);
    
}

export const parseSSE = async (stream) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    result += chunk;
  }

  return result;
}

export const safeJSONParse = (text) => {
  try {
    const match = text.match(/\[.*\]/s);
    if (!match) return null;

    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}