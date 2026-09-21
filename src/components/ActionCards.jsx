import React from "react";
import { Camera, Search, Barcode, Dumbbell, Sparkles } from "lucide-react";

export default function ActionCards({ onOpenPhotoAi, onOpenSearch, onOpenBarcode, onOpenWorkout }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* 1. Snap Meal (AI Vision) */}
      <button
        onClick={onOpenPhotoAi}
        className="group relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-850 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
          <Sparkles className="w-2.5 h-2.5" /> AI
        </div>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 mb-3 group-hover:scale-105 transition-transform">
          <Camera className="w-5 h-5 text-slate-950" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
          Snap Meal (AI)
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-tight">
          Take a photo of your plate, AI figures out protein.
        </p>
      </button>

      {/* 2. Food Search */}
      <button
        onClick={onOpenSearch}
        className="group relative overflow-hidden bg-gradient-to-br from-emerald-950/30 via-slate-850 to-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 mb-3 group-hover:scale-105 transition-transform">
          <Search className="w-5 h-5 text-slate-950" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
          Search Food
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-tight">
          Type food name, instant auto-calculated protein.
        </p>
      </button>

      {/* 3. Barcode Scanner */}
      <button
        onClick={onOpenBarcode}
        className="group relative overflow-hidden bg-gradient-to-br from-purple-950/30 via-slate-850 to-slate-900 border border-slate-800 hover:border-purple-500/40 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-purple-500/20 mb-3 group-hover:scale-105 transition-transform">
          <Barcode className="w-5 h-5 text-slate-950" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors">
          Scan Barcode
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-tight">
          Point camera at packaged items or enter code.
        </p>
      </button>

      {/* 4. Gym Workout */}
      <button
        onClick={onOpenWorkout}
        className="group relative overflow-hidden bg-gradient-to-br from-amber-950/30 via-slate-850 to-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 mb-3 group-hover:scale-105 transition-transform">
          <Dumbbell className="w-5 h-5 text-slate-950" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
          Gym Workout
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-tight">
          Log sets, reps & unlock post-workout recovery.
        </p>
      </button>
    </section>
  );
}
