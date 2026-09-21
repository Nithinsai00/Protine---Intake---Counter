// AI Vision Food Analyzer (Powered by Google Gemini 1.5 Flash Vision)

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function analyzeFoodImage(base64Image, mimeType = "image/jpeg", apiKey = "") {
  if (!base64Image) {
    throw new Error("No image data provided for analysis.");
  }

  // Remove data:image/...;base64, prefix if present
  const base64Data = base64Image.includes(",") 
    ? base64Image.split(",")[1] 
    : base64Image;

  const key = apiKey?.trim();

  // If user provided a Gemini API key, use real AI
  if (key) {
    return await callGeminiVisionApi(base64Data, mimeType, key);
  }

  // Fallback: Smart Demo Mode when no API key is configured yet
  return await simulateFoodVisionAnalysis(base64Data);
}

async function callGeminiVisionApi(base64Data, mimeType, apiKey) {
  const prompt = `
You are an elite sports nutritionist and computer vision AI.
Analyze this meal image carefully.
Identify all visible food items on the plate or in the meal.
For each item:
- Estimate the portion size in grams (or standard measure) based on visual cues.
- Calculate the protein content in grams.
- Calculate approximate calories, carbs in grams, and fat in grams.

Return ONLY a valid JSON object (no markdown, no backticks, no extra text) in this exact schema:
{
  "meal_name": "Short descriptive title of the meal",
  "total_protein_g": 38.5,
  "total_calories": 450,
  "total_carbs_g": 35.0,
  "total_fat_g": 12.0,
  "items": [
    {
      "name": "Food item name",
      "portion_g": 150,
      "protein_g": 31.0,
      "calories": 165,
      "carbs_g": 0,
      "fat_g": 3.6,
      "confidence": "high"
    }
  ],
  "nutrition_insights": "A helpful 1-sentence tip regarding protein quality, leucine content, or timing for athletic performance."
}
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      response_mime_type: "application/json"
    }
  };

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `API error ${response.status}`;
    throw new Error(`Gemini Vision API error: ${message}`);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("AI did not return a response. Please try taking another photo with clearer lighting.");
  }

  // Parse JSON cleanly
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      isAiPowered: true,
      ...parsed
    };
  } catch (err) {
    console.error("Failed to parse Gemini output:", rawText);
    throw new Error("Could not interpret AI response. Please try another clear angle.");
  }
}

// Built-in intelligent demo analyzer for when user is testing without an API key
async function simulateFoodVisionAnalysis() {
  // Simulate network & AI processing delay for realism
  await new Promise(res => setTimeout(res, 2200));

  const demoMeals = [
    {
      meal_name: "Grilled Chicken, Brown Rice & Broccoli Plate",
      total_protein_g: 44.5,
      total_calories: 520,
      total_carbs_g: 54.0,
      total_fat_g: 8.5,
      items: [
        {
          name: "Grilled Chicken Breast",
          portion_g: 160,
          protein_g: 38.0,
          calories: 195,
          carbs_g: 0,
          fat_g: 4.2,
          confidence: "high"
        },
        {
          name: "Steamed Jasmine / Brown Rice",
          portion_g: 150,
          protein_g: 3.8,
          calories: 180,
          carbs_g: 39.0,
          fat_g: 1.0,
          confidence: "high"
        },
        {
          name: "Steamed Fresh Broccoli",
          portion_g: 100,
          protein_g: 2.7,
          calories: 35,
          carbs_g: 7.0,
          fat_g: 0.4,
          confidence: "high"
        }
      ],
      nutrition_insights: "Great high-leucine complete protein source paired with complex carbs for glycogen replenishment."
    },
    {
      meal_name: "Seared Salmon Fillet with Quinoa & Asparagus",
      total_protein_g: 38.0,
      total_calories: 480,
      total_carbs_g: 32.0,
      total_fat_g: 18.0,
      items: [
        {
          name: "Atlantic Salmon Fillet",
          portion_g: 150,
          protein_g: 32.0,
          calories: 280,
          carbs_g: 0,
          fat_g: 16.0,
          confidence: "high"
        },
        {
          name: "Fluffy Cooked Quinoa",
          portion_g: 100,
          protein_g: 4.4,
          calories: 120,
          carbs_g: 21.0,
          fat_g: 1.9,
          confidence: "high"
        },
        {
          name: "Grilled Asparagus Spears",
          portion_g: 80,
          protein_g: 1.6,
          calories: 20,
          carbs_g: 3.5,
          fat_g: 0.2,
          confidence: "high"
        }
      ],
      nutrition_insights: "Rich in Omega-3 fatty acids and complete essential amino acids to reduce post-workout inflammation."
    },
    {
      meal_name: "Scrambled Eggs & Avocado Toast with Feta",
      total_protein_g: 26.5,
      total_calories: 410,
      total_carbs_g: 28.0,
      total_fat_g: 22.0,
      items: [
        {
          name: "Whole Eggs (3 Scrambled)",
          portion_g: 150,
          protein_g: 19.0,
          calories: 225,
          carbs_g: 1.5,
          fat_g: 15.0,
          confidence: "high"
        },
        {
          name: "Sourdough Bread (1 thick slice)",
          portion_g: 60,
          protein_g: 4.5,
          calories: 140,
          carbs_g: 26.0,
          fat_g: 1.0,
          confidence: "high"
        },
        {
          name: "Hass Avocado & Crumbled Feta",
          portion_g: 50,
          protein_g: 3.0,
          calories: 95,
          carbs_g: 3.0,
          fat_g: 8.0,
          confidence: "medium"
        }
      ],
      nutrition_insights: "High biological value egg protein provides all 9 essential amino acids for optimal recovery."
    }
  ];

  // Pick a random sample demo
  const sample = demoMeals[Math.floor(Math.random() * demoMeals.length)];

  return {
    isDemo: true,
    demoNotice: "Demo Mode Active. To analyze your own custom photos with live AI, add your free Gemini API Key in Settings.",
    ...sample
  };
}
