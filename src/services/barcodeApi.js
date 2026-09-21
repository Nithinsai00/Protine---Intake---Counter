// Open Food Facts Barcode Lookup (Free, No API Key Required)

export async function lookupBarcodeOnline(rawBarcode) {
  if (!rawBarcode) throw new Error("Please provide a valid barcode.");
  const barcode = String(rawBarcode).trim().replace(/[^0-9]/g, "");

  if (barcode.length < 5) {
    throw new Error("Invalid barcode length. Most food barcodes are 8 to 13 digits.");
  }

  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=code,product_name,brands,nutriments,serving_size,image_front_small_url`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ProPulseProteinTracker - Web - Version 1.0 (contact@propulse-tracker.app)"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Product lookup failed with status ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== 1 || !data.product) {
      throw new Error("Product not found in Open Food Facts database. You can search by name instead!");
    }

    const prod = data.product;
    const nutriments = prod.nutriments || {};

    // Get protein per 100g and per serving if available
    let protein100g = Number(nutriments.proteins_100g ?? nutriments.proteins ?? 0);
    let proteinServing = Number(nutriments.proteins_serving ?? 0);

    let calories100g = Number(nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"] ?? 0);
    let carbs100g = Number(nutriments.carbohydrates_100g ?? nutriments.carbohydrates ?? 0);
    let fat100g = Number(nutriments.fat_100g ?? nutriments.fat ?? 0);

    // Parse serving size in grams if possible
    let servingGrams = 100;
    const servingStr = prod.serving_size || "";
    const match = servingStr.match(/([0-9]+(?:\.[0-9]+)?)\s*g/i);
    if (match) {
      servingGrams = parseFloat(match[1]);
    } else if (proteinServing > 0 && protein100g > 0) {
      servingGrams = Math.round((proteinServing / protein100g) * 100);
    }

    const title = prod.product_name || "Unknown Product";
    const brand = prod.brands ? ` (${prod.brands})` : "";

    return {
      id: `barcode-${barcode}`,
      barcode: barcode,
      name: `${title}${brand}`,
      brand: prod.brands || "",
      proteinPer100g: Math.round(protein100g * 10) / 10,
      proteinPerServing: proteinServing > 0 ? Math.round(proteinServing * 10) / 10 : null,
      caloriesPer100g: Math.round(calories100g),
      carbsPer100g: Math.round(carbs100g * 10) / 10,
      fatPer100g: Math.round(fat100g * 10) / 10,
      defaultServingGrams: servingGrams,
      servingUnitName: prod.serving_size || `${servingGrams}g`,
      imageUrl: prod.image_front_small_url || null,
      icon: "📦",
      source: "Open Food Facts"
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your internet connection.");
    }
    throw err;
  }
}
