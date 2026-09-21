import React from "react";
import { Dumbbell, Clock, Flame, Zap, Trash2, Edit3, Plus } from "lucide-react";

export default function WorkoutLogList({ workout, onOpenWorkout, onDeleteWorkout, onOpenSearch }) {
  if (!workout) {
    return (
      <section className="bg-slate-850/40 border border-slate-800/80 rounded-3xl p-6 text-center my-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
          🏋️‍♂️
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Workout Logged Today</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Log your gym session (Push, Pull, Legs) to activate your post-workout protein recovery tracker.
        </p>
        <button
          onClick={onOpenWorkout}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-amber-500/20 hover:brightness-110 transition-all"
        >
          <Dumbbell className="w-3.5 h-3.5" /> Log Today's Workout
        </button>
      </section>
    );
  }

  return (
    <section className="bg-slate-850/60 border border-slate-800 rounded-3xl p-5 sm:p-6 my-6 space-y-4">
      {/* Workout Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
            {workout.icon || "🏋️"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">{workout.splitName}</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Completed
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> {workout.durationMinutes} mins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" /> ~{workout.caloriesBurned} kcal
              </span>
              {workout.totalVolumeKg > 0 && (
                <>
                  <span>•</span>
                  <span>Volume: <strong className="text-cyan-400">{workout.totalVolumeKg} kg</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenWorkout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Edit workout"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteWorkout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete workout"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post-Workout Protein Recovery Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Post-Workout Protein Target:</span>
              <span className="text-emerald-400 font-extrabold text-sm">{workout.recommendedProtein}g</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {workout.recoveryTip || "Fuel your muscles to stimulate muscle protein synthesis."}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Log Protein Shake
        </button>
      </div>

      {/* Exercises List */}
      {workout.exercises?.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] uppercase font-bold text-slate-400 px-1">
            Completed Exercises ({workout.exercises.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {workout.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-white truncate mr-2">{ex.name}</span>
                <span className="text-slate-400 font-medium flex-shrink-0">
                  {ex.sets} × {ex.reps} {ex.weightKg > 0 ? `@ ${ex.weightKg}kg` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
