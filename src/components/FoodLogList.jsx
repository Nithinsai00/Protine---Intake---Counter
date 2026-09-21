import React from "react";
import { Trash2, Clock, Sparkles, Barcode, Search, Utensils } from "lucide-react";

export default function FoodLogList({ foods = [], onDeleteFood, onOpenPhotoAi, onOpenSearch }) {
  if (foods.length === 0) {
    return (
      <section className="bg-slate-850/40 border border-slate-800/80 rounded-3xl p-8 text-center my-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
          🥗
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Food Logged Today Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
          You don't need to type protein numbers! Just snap a photo of your meal, scan a barcode, or search by food name.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onOpenPhotoAi}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Snap Photo (AI)
          </button>
          <button
            onClick={onOpenSearch}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Search className="w-3.5 h-3.5" /> Search Food
          </button>
        </div>
      </section>
    );
  }

  // Group foods by mealCategory
  const categories = ["Breakfast", "Lunch", "Dinner", "Post-Workout", "Snack"];
  const grouped = categories.map((cat) => {
    const items = foods.filter(f => (f.mealCategory || "Snack").toLowerCase() === cat.toLowerCase());
    const totalCatProtein = items.reduce((sum, item) => sum + (item.proteinGrams || 0), 0);
    return {
      category: cat,
      items,
      totalProtein: Math.round(totalCatProtein * 10) / 10
    };
  }).filter(group => group.items.length > 0);

  return (
    <section className="space-y-5 my-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Utensils className="w-4 h-4 text-cyan-400" /> Today's Meal Diary
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {foods.length} {foods.length === 1 ? "item" : "items"} logged
        </span>
      </div>

      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.category} className="bg-slate-850/60 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Category header */}
            <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                {group.category}
              </span>
              <span className="text-xs font-extrabold text-cyan-400">
                {group.totalProtein}g protein
              </span>
            </div>

            {/* Food items in category */}
            <div className="divide-y divide-slate-800/50">
              {group.items.map((food) => (
                <div
                  key={food.id}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xl flex-shrink-0">{food.icon || "🍽️"}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {food.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{food.portionGrams}g</span>
                        {food.calories > 0 && <span>• {food.calories} kcal</span>}
                        {food.timestamp && (
                          <span className="text-slate-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> {food.timestamp}
                          </span>
                        )}
                        {food.source === "AI Vision" && (
                          <span className="text-[9px] px-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                            AI
                          </span>
                        )}
                        {food.source === "Barcode Scan" && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                            Barcode
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Protein amount and Delete button */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-emerald-400">
                        {food.proteinGrams}g
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">
                        protein
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteFood(food.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
