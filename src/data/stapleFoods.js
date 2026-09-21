// Comprehensive curated database of staple high-protein foods
// Values are per 100g standard edible portion

export const STAPLE_FOODS = [
  // Poultry & Meats
  {
    id: "staple-chicken-breast",
    name: "Chicken Breast (Cooked / Grilled)",
    category: "Meat & Poultry",
    proteinPer100g: 31.0,
    caloriesPer100g: 165,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    defaultServingGrams: 150,
    servingUnitName: "breast (approx 150g)",
    icon: "🍗",
    isVeg: false
  },
  {
    id: "staple-chicken-thigh",
    name: "Chicken Thigh (Skinless, Cooked)",
    category: "Meat & Poultry",
    proteinPer100g: 24.5,
    caloriesPer100g: 209,
    carbsPer100g: 0,
    fatPer100g: 10.9,
    defaultServingGrams: 120,
    servingUnitName: "thigh",
    icon: "🍗",
    isVeg: false
  },
  {
    id: "staple-turkey-breast",
    name: "Ground Turkey (93% Lean)",
    category: "Meat & Poultry",
    proteinPer100g: 27.0,
    caloriesPer100g: 150,
    carbsPer100g: 0,
    fatPer100g: 5.0,
    defaultServingGrams: 150,
    servingUnitName: "portion",
    icon: "🦃",
    isVeg: false
  },
  {
    id: "staple-beef-steak",
    name: "Lean Beef Steak (Sirloin, Cooked)",
    category: "Meat & Poultry",
    proteinPer100g: 29.0,
    caloriesPer100g: 210,
    carbsPer100g: 0,
    fatPer100g: 10.0,
    defaultServingGrams: 170,
    servingUnitName: "steak",
    icon: "🥩",
    isVeg: false
  },
  {
    id: "staple-ground-beef",
    name: "Lean Ground Beef (90/10, Cooked)",
    category: "Meat & Poultry",
    proteinPer100g: 26.0,
    caloriesPer100g: 215,
    carbsPer100g: 0,
    fatPer100g: 12.0,
    defaultServingGrams: 150,
    servingUnitName: "patty / serving",
    icon: "🥩",
    isVeg: false
  },

  // Seafood
  {
    id: "staple-salmon",
    name: "Atlantic Salmon (Grilled / Baked)",
    category: "Fish & Seafood",
    proteinPer100g: 25.0,
    caloriesPer100g: 208,
    carbsPer100g: 0,
    fatPer100g: 12.0,
    defaultServingGrams: 150,
    servingUnitName: "fillet",
    icon: "🐟",
    isVeg: false
  },
  {
    id: "staple-tuna-canned",
    name: "Canned Tuna (in Water, Drained)",
    category: "Fish & Seafood",
    proteinPer100g: 26.0,
    caloriesPer100g: 116,
    carbsPer100g: 0,
    fatPer100g: 1.0,
    defaultServingGrams: 120,
    servingUnitName: "can",
    icon: "🥫",
    isVeg: false
  },
  {
    id: "staple-tilapia",
    name: "Tilapia / White Fish Fillet",
    category: "Fish & Seafood",
    proteinPer100g: 26.0,
    caloriesPer100g: 128,
    carbsPer100g: 0,
    fatPer100g: 2.7,
    defaultServingGrams: 130,
    servingUnitName: "fillet",
    icon: "🐟",
    isVeg: false
  },
  {
    id: "staple-shrimp",
    name: "Shrimp / Prawns (Steamed)",
    category: "Fish & Seafood",
    proteinPer100g: 24.0,
    caloriesPer100g: 99,
    carbsPer100g: 0.2,
    fatPer100g: 0.3,
    defaultServingGrams: 120,
    servingUnitName: "portion (approx 8-10 shrimp)",
    icon: "🦐",
    isVeg: false
  },

  // Eggs & Dairy
  {
    id: "staple-whole-egg",
    name: "Whole Egg (Large, Boiled/Poached)",
    category: "Eggs & Dairy",
    proteinPer100g: 12.6,
    caloriesPer100g: 155,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    defaultServingGrams: 50,
    servingUnitName: "1 large egg (approx 6.3g protein)",
    icon: "🥚",
    isVeg: true
  },
  {
    id: "staple-egg-white",
    name: "Egg Whites (Liquid or Boiled)",
    category: "Eggs & Dairy",
    proteinPer100g: 11.0,
    caloriesPer100g: 52,
    carbsPer100g: 0.7,
    fatPer100g: 0.2,
    defaultServingGrams: 100,
    servingUnitName: "3 egg whites (approx 100g)",
    icon: "🍳",
    isVeg: true
  },
  {
    id: "staple-greek-yogurt",
    name: "Greek Yogurt (Nonfat Plain)",
    category: "Eggs & Dairy",
    proteinPer100g: 10.0,
    caloriesPer100g: 59,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    defaultServingGrams: 170,
    servingUnitName: "1 cup / tub (approx 17g protein)",
    icon: "🥣",
    isVeg: true
  },
  {
    id: "staple-cottage-cheese",
    name: "Cottage Cheese (Low Fat 1-2%)",
    category: "Eggs & Dairy",
    proteinPer100g: 11.8,
    caloriesPer100g: 82,
    carbsPer100g: 4.3,
    fatPer100g: 1.0,
    defaultServingGrams: 150,
    servingUnitName: "bowl (approx 18g protein)",
    icon: "🧀",
    isVeg: true
  },
  {
    id: "staple-paneer",
    name: "Paneer (Indian Cottage Cheese)",
    category: "Eggs & Dairy",
    proteinPer100g: 18.3,
    caloriesPer100g: 296,
    carbsPer100g: 4.2,
    fatPer100g: 22.0,
    defaultServingGrams: 100,
    servingUnitName: "100g portion",
    icon: "🧀",
    isVeg: true
  },
  {
    id: "staple-low-fat-paneer",
    name: "Low-Fat Paneer",
    category: "Eggs & Dairy",
    proteinPer100g: 25.0,
    caloriesPer100g: 160,
    carbsPer100g: 3.0,
    fatPer100g: 5.0,
    defaultServingGrams: 100,
    servingUnitName: "100g block",
    icon: "🧀",
    isVeg: true
  },
  {
    id: "staple-cow-milk",
    name: "Milk (Skim / Low Fat)",
    category: "Eggs & Dairy",
    proteinPer100g: 3.4,
    caloriesPer100g: 42,
    carbsPer100g: 5.0,
    fatPer100g: 1.0,
    defaultServingGrams: 250,
    servingUnitName: "1 glass (250ml / 8.5g protein)",
    icon: "🥛",
    isVeg: true
  },

  // Protein Powders & Supplements
  {
    id: "staple-whey-isolate",
    name: "Whey Protein Isolate Powder",
    category: "Supplements",
    proteinPer100g: 83.3,
    caloriesPer100g: 370,
    carbsPer100g: 2.0,
    fatPer100g: 1.5,
    defaultServingGrams: 30,
    servingUnitName: "1 scoop (approx 25g protein)",
    icon: "🥤",
    isVeg: true
  },
  {
    id: "staple-whey-concentrate",
    name: "Whey Protein Concentrate Powder",
    category: "Supplements",
    proteinPer100g: 75.0,
    caloriesPer100g: 395,
    carbsPer100g: 6.0,
    fatPer100g: 6.0,
    defaultServingGrams: 32,
    servingUnitName: "1 scoop (approx 24g protein)",
    icon: "🥤",
    isVeg: true
  },
  {
    id: "staple-casein-protein",
    name: "Micellar Casein Powder (Slow Digesting)",
    category: "Supplements",
    proteinPer100g: 78.0,
    caloriesPer100g: 360,
    carbsPer100g: 4.0,
    fatPer100g: 2.0,
    defaultServingGrams: 32,
    servingUnitName: "1 scoop (approx 25g protein)",
    icon: "🥤",
    isVeg: true
  },
  {
    id: "staple-plant-protein",
    name: "Plant / Pea & Rice Protein Powder",
    category: "Supplements",
    proteinPer100g: 75.0,
    caloriesPer100g: 380,
    carbsPer100g: 5.0,
    fatPer100g: 5.0,
    defaultServingGrams: 33,
    servingUnitName: "1 scoop (approx 24g protein)",
    icon: "🌱",
    isVeg: true
  },

  // Plant-Based & Vegetarian Proteins
  {
    id: "staple-firm-tofu",
    name: "Firm Tofu",
    category: "Plant-Based",
    proteinPer100g: 12.0,
    caloriesPer100g: 85,
    carbsPer100g: 2.0,
    fatPer100g: 4.8,
    defaultServingGrams: 150,
    servingUnitName: "block portion",
    icon: "🌱",
    isVeg: true
  },
  {
    id: "staple-tempeh",
    name: "Tempeh (Cooked)",
    category: "Plant-Based",
    proteinPer100g: 19.0,
    caloriesPer100g: 192,
    carbsPer100g: 9.0,
    fatPer100g: 11.0,
    defaultServingGrams: 100,
    servingUnitName: "serving",
    icon: "🌱",
    isVeg: true
  },
  {
    id: "staple-seitan",
    name: "Seitan (Wheat Gluten)",
    category: "Plant-Based",
    proteinPer100g: 25.0,
    caloriesPer100g: 140,
    carbsPer100g: 5.0,
    fatPer100g: 2.0,
    defaultServingGrams: 100,
    servingUnitName: "serving (approx 25g protein)",
    icon: "🌾",
    isVeg: true
  },
  {
    id: "staple-soya-chunks",
    name: "Soya Chunks / TVP (Dried)",
    category: "Plant-Based",
    proteinPer100g: 52.0,
    caloriesPer100g: 345,
    carbsPer100g: 33.0,
    fatPer100g: 0.5,
    defaultServingGrams: 40,
    servingUnitName: "1 bowl cooked (approx 21g protein)",
    icon: "🥣",
    isVeg: true
  },
  {
    id: "staple-edamame",
    name: "Edamame Beans (Steamed)",
    category: "Plant-Based",
    proteinPer100g: 11.9,
    caloriesPer100g: 122,
    carbsPer100g: 8.9,
    fatPer100g: 5.2,
    defaultServingGrams: 150,
    servingUnitName: "cup",
    icon: "🫘",
    isVeg: true
  },
  {
    id: "staple-lentils-cooked",
    name: "Lentils / Dal (Boiled/Cooked)",
    category: "Grains & Legumes",
    proteinPer100g: 9.0,
    caloriesPer100g: 116,
    carbsPer100g: 20.0,
    fatPer100g: 0.4,
    defaultServingGrams: 200,
    servingUnitName: "1 cup / bowl (approx 18g protein)",
    icon: "🍲",
    isVeg: true
  },
  {
    id: "staple-chickpeas",
    name: "Chickpeas / Garbanzo (Cooked)",
    category: "Grains & Legumes",
    proteinPer100g: 8.9,
    caloriesPer100g: 164,
    carbsPer100g: 27.4,
    fatPer100g: 2.6,
    defaultServingGrams: 160,
    servingUnitName: "1 cup",
    icon: "🫘",
    isVeg: true
  },
  {
    id: "staple-black-beans",
    name: "Black Beans (Cooked)",
    category: "Grains & Legumes",
    proteinPer100g: 8.9,
    caloriesPer100g: 132,
    carbsPer100g: 23.7,
    fatPer100g: 0.5,
    defaultServingGrams: 170,
    servingUnitName: "1 cup",
    icon: "🫘",
    isVeg: true
  },
  {
    id: "staple-rolled-oats",
    name: "Rolled Oats (Raw)",
    category: "Grains & Legumes",
    proteinPer100g: 13.5,
    caloriesPer100g: 379,
    carbsPer100g: 68.0,
    fatPer100g: 6.5,
    defaultServingGrams: 50,
    servingUnitName: "1/2 cup dry (approx 7g protein)",
    icon: "🥣",
    isVeg: true
  },
  {
    id: "staple-quinoa",
    name: "Quinoa (Cooked)",
    category: "Grains & Legumes",
    proteinPer100g: 4.4,
    caloriesPer100g: 120,
    carbsPer100g: 21.3,
    fatPer100g: 1.9,
    defaultServingGrams: 185,
    servingUnitName: "1 cup cooked",
    icon: "🍚",
    isVeg: true
  },

  // Nuts, Seeds & Butters
  {
    id: "staple-peanut-butter",
    name: "Peanut Butter (Natural)",
    category: "Nuts & Spreads",
    proteinPer100g: 25.0,
    caloriesPer100g: 588,
    carbsPer100g: 20.0,
    fatPer100g: 50.0,
    defaultServingGrams: 32,
    servingUnitName: "2 tbsp (approx 8g protein)",
    icon: "🥜",
    isVeg: true
  },
  {
    id: "staple-almonds",
    name: "Almonds (Raw)",
    category: "Nuts & Spreads",
    proteinPer100g: 21.2,
    caloriesPer100g: 579,
    carbsPer100g: 21.6,
    fatPer100g: 49.9,
    defaultServingGrams: 30,
    servingUnitName: "handful (approx 23 nuts / 6.4g protein)",
    icon: "🌰",
    isVeg: true
  },
  {
    id: "staple-chia-seeds",
    name: "Chia Seeds",
    category: "Nuts & Spreads",
    proteinPer100g: 16.5,
    caloriesPer100g: 486,
    carbsPer100g: 42.1,
    fatPer100g: 30.7,
    defaultServingGrams: 25,
    servingUnitName: "2 tbsp",
    icon: "🌱",
    isVeg: true
  }
];

// Helper to search staples locally
export function searchStapleFoods(query) {
  if (!query || query.trim().length === 0) return [];
  const clean = query.toLowerCase().trim();
  const words = clean.split(/\s+/);

  return STAPLE_FOODS.filter(food => {
    const target = `${food.name} ${food.category}`.toLowerCase();
    return words.every(w => target.includes(w));
  });
}
