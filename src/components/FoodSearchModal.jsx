import React, { useState, useEffect, useTransition } from "react";
import { X, Search, Plus, Check, Loader2, Sparkles, Scale } from "lucide-react";
import { searchFoodsOnlineAndOffline } from "../services/usdaApi";
import { STAPLE_FOODS } from "../data/stapleFoods";

export default function FoodSearchModal({ isOpen, onClose, onAddFood, usdaApiKey }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionGrams, setPortionGrams] = useState(100);
  const [mealCategory, setMealCategory] = useState("Lunch");
  const [isPending, startTransition] = useTransition();

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Show popular staples by default
      setResults(STAPLE_FOODS.slice(0, 10));
      setSelectedFood(null);
      setPortionGrams(100);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      setResults(STAPLE_FOODS.slice(0, 10));
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const found = await searchFoodsOnlineAndOffline(query, usdaApiKey);
        startTransition(() => {
          setResults(found);
          setLoading(false);
        });
      } catch (err) {
        console.error("Search error:", err);
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, isOpen, usdaApiKey]);

  if (!isOpen) return null;

  // Calculate dynamic macros based on portion
  const factor = portionGrams / 100;
  const computedProtein = selectedFood ? Math.round((selectedFood.proteinPer100g * factor) * 10) / 10 : 0;
  const computedCalories = selectedFood ? Math.round(selectedFood.caloriesPer100g * factor) : 0;
  const computedCarbs = selectedFood ? Math.round((selectedFood.carbsPer100g * factor) * 10) / 10 : 0;
  const computedFat = selectedFood ? Math.round((selectedFood.fatPer100g * factor) * 10) / 10 : 0;

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setPortionGrams(food.defaultServingGrams || 100);
  };

  const handleConfirmLog = () => {
    if (!selectedFood) return;

    onAddFood({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: selectedFood.name,
      icon: selectedFood.icon || "🍽️",
      portionGrams: Number(portionGrams),
      proteinGrams: computedProtein,
      calories: computedCalories,
      carbs: computedCarbs,
      fat: computedFat,
      mealCategory: mealCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              🔍
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Food Search & Auto-Protein</h2>
              <p className="text-[11px] text-slate-400">Select any food to calculate exact protein</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-850/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Chicken breast, Greek yogurt, Boiled egg, Whey..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              autoFocus
            />
            {loading && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
            {!loading && query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Modal Body: Food List OR Portion Adjuster */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!selectedFood ? (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                <span>{query.trim() ? "Search Results" : "Popular Fitness Staples"}</span>
                <span className="text-[10px] text-cyan-400">Auto-Calculates</span>
              </div>

              {results.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm">No exact matches found for "{query}".</p>
                  <p className="text-xs text-slate-500 mt-1">Try generic names like "egg", "tofu", "paneer", or "fish".</p>
                </div>
              )}

              {results.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-cyan-500/30 rounded-2xl p-3 text-left flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl flex-shrink-0">{food.icon || "🍽️"}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                        {food.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{food.category}</span>
                        {food.servingUnitName && (
                          <span className="text-slate-500">• {food.servingUnitName}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-sm font-extrabold text-emerald-400">
                      {food.proteinPer100g}g
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      per 100g
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            /* Selected Food Portion Customization */
            <div className="space-y-4 py-1">
              {/* Back to list */}
              <button
                onClick={() => setSelectedFood(null)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                ← Back to search results
              </button>

              {/* Selected Item Summary Card */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedFood.icon || "🍽️"}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{selectedFood.name}</h3>
                    <p className="text-xs text-slate-400">Base: {selectedFood.proteinPer100g}g protein / 100g</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Protein Highlight */}
              <div className="bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-cyan-500/40 rounded-2xl p-4 text-center">
                <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                  Calculated Protein
                </span>
                <div className="text-4xl font-black text-white mt-1">
                  <span className="text-cyan-300">{computedProtein}</span>
                  <span className="text-base font-semibold text-emerald-400 ml-1">grams</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-300 mt-2">
                  <span>🔥 {computedCalories} kcal</span>
                  <span>🌾 {computedCarbs}g carbs</span>
                  <span>🥑 {computedFat}g fat</span>
                </div>
              </div>

              {/* Portion Slider & Input */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-cyan-400" /> Portion Weight:
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={portionGrams}
                      onChange={(e) => setPortionGrams(Math.max(1, Number(e.target.value) || 0))}
                      className="w-16 bg-transparent text-right font-black text-white focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">grams</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[50, 100, 150, 200, 250, 300].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPortionGrams(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        portionGrams === preset
                          ? "bg-cyan-500 text-slate-950 shadow"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {preset}g
                    </button>
                  ))}
                  {selectedFood.defaultServingGrams && selectedFood.defaultServingGrams !== 100 && (
                    <button
                      type="button"
                      onClick={() => setPortionGrams(selectedFood.defaultServingGrams)}
                      className="text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      1 standard serving ({selectedFood.defaultServingGrams}g)
                    </button>
                  )}
                </div>
              </div>

              {/* Meal Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Log As Meal:</label>
                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {["Breakfast", "Lunch", "Dinner", "Post-Workout", "Snack"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealCategory(cat)}
                      className={`py-1.5 rounded-xl font-bold truncate px-1 transition-colors ${
                        mealCategory === cat
                          ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {selectedFood && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex gap-3">
            <button
              onClick={() => setSelectedFood(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLog}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Add {computedProtein}g Protein to Diary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
