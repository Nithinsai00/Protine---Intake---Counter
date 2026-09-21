import { searchStapleFoods } from "../data/stapleFoods";

// USDA FoodData Central search with local staple food fallback
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1/foods/search";
const DEFAULT_API_KEY = "DEMO_KEY";

export async function searchFoodsOnlineAndOffline(query, customApiKey = "") {
  if (!query || query.trim().length === 0) return [];
  const cleanQuery = query.trim();

  // 1. First get local instant matches
  const localMatches = searchStapleFoods(cleanQuery);

  // 2. Fetch live results from USDA database in background
  try {
    const apiKey = customApiKey?.trim() || DEFAULT_API_KEY;
    const url = `${USDA_API_ENDPOINT}?query=${encodeURIComponent(cleanQuery)}&pageSize=10&api_key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn("USDA API returned status:", res.status);
      return localMatches;
    }

    const data = await res.json();
    const usdaFoods = (data.foods || []).map(item => parseUsdaFoodItem(item)).filter(Boolean);

    // Merge without duplicates (local matches first for best UX)
    const existingNames = new Set(localMatches.map(m => m.name.toLowerCase()));
    const filteredUsda = usdaFoods.filter(item => !existingNames.has(item.name.toLowerCase()));

    return [...localMatches, ...filteredUsda];
  } catch (err) {
    console.info("Using local staple database for search (USDA API unreachable or offline):", err.message);
    return localMatches;
  }
}

function parseUsdaFoodItem(item) {
  if (!item || !item.description) return null;

  const nutrients = item.foodNutrients || [];
  
  // Nutrient IDs for USDA:
  // 1003 = Protein
  // 1008 = Energy / Calories
  // 1005 = Carbohydrates
  // 1004 = Total Fat
  const findNutrient = (namePatterns, fallbackId) => {
    const match = nutrients.find(n => {
      const name = (n.nutrientName || "").toLowerCase();
      return namePatterns.some(p => name.includes(p)) || n.nutrientId === fallbackId || Number(n.nutrientNumber) === fallbackId;
    });
    return match ? Number(match.value) || 0 : 0;
  };

  const protein = findNutrient(["protein"], 1003);
  const calories = findNutrient(["energy"], 1008);
  const carbs = findNutrient(["carbohydrate"], 1005);
  const fat = findNutrient(["total lipid", "fat"], 1004);

  // If servingSize is provided, convert to per 100g if needed
  let servingGrams = Number(item.servingSize) || 100;
  let servingUnit = item.servingSizeUnit || "g";
  let servingText = item.householdServingFullText || `${servingGrams}${servingUnit}`;

  let proteinPer100g = protein;
  if (item.servingSize && item.servingSize > 0 && item.dataType === "Branded") {
    // For branded foods, nutrients in USDA are usually given per 100g or per serving
    // If given per 100g directly:
    proteinPer100g = protein;
  }

  // Capitalize description nicely
  const displayName = item.description
    .toLowerCase()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: `usda-${item.fdcId}`,
    name: displayName,
    brand: item.brandOwner || item.brandName || "",
    category: item.foodCategory || "General Food",
    proteinPer100g: Math.round(proteinPer100g * 10) / 10,
    caloriesPer100g: Math.round(calories),
    carbsPer100g: Math.round(carbs * 10) / 10,
    fatPer100g: Math.round(fat * 10) / 10,
    defaultServingGrams: servingGrams,
    servingUnitName: servingText,
    icon: "🍽️",
    source: "USDA FoodData"
  };
}
