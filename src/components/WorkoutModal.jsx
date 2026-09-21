import React, { useState } from "react";
import { X, Dumbbell, Plus, Trash2, Check, Clock, Flame, Zap, ShieldCheck } from "lucide-react";
import { WORKOUT_SPLITS, GYM_EXERCISES, getRecommendedPostWorkoutProtein } from "../data/gymExercises";

export default function WorkoutModal({ isOpen, onClose, onSaveWorkout, existingWorkout }) {
  const [selectedSplit, setSelectedSplit] = useState(existingWorkout?.splitId || "push");
  const [durationMinutes, setDurationMinutes] = useState(existingWorkout?.durationMinutes || 50);
  const [intensity, setIntensity] = useState(existingWorkout?.intensity || "moderate");
  const [exercises, setExercises] = useState(
    existingWorkout?.exercises || [
      { id: "bench-press", name: "Barbell Bench Press", sets: 3, reps: 8, weightKg: 60 }
    ]
  );
  const [newExerciseId, setNewExerciseId] = useState("");

  if (!isOpen) return null;

  const currentSplitObj = WORKOUT_SPLITS.find(s => s.id === selectedSplit) || WORKOUT_SPLITS[0];
  const postWorkoutRecommendation = getRecommendedPostWorkoutProtein(selectedSplit, durationMinutes);

  // Available exercises filtered by current split
  const availableExercises = GYM_EXERCISES.filter(ex => ex.split === selectedSplit || ex.split === "full_body");

  // Calorie burn calculation estimate
  const intensityMultiplier = intensity === "high" ? 8.5 : intensity === "moderate" ? 6.5 : 4.5;
  const estimatedCalories = Math.round(durationMinutes * intensityMultiplier);

  const handleAddExercise = (exerciseId) => {
    const ex = GYM_EXERCISES.find(e => e.id === exerciseId);
    if (!ex) return;

    setExercises([
      ...exercises,
      {
        id: ex.id,
        name: ex.name,
        sets: ex.defaultSets || 3,
        reps: ex.defaultReps || 10,
        weightKg: 20
      }
    ]);
    setNewExerciseId("");
  };

  const handleUpdateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    setExercises(updated);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const totalVolume = exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * (ex.weightKg || 0)), 0);

    onSaveWorkout({
      id: existingWorkout?.id || `workout-${Date.now()}`,
      splitId: selectedSplit,
      splitName: currentSplitObj.name,
      icon: currentSplitObj.icon,
      durationMinutes,
      intensity,
      caloriesBurned: estimatedCalories,
      totalVolumeKg: Math.round(totalVolume),
      exercises: exercises,
      recommendedProtein: postWorkoutRecommendation.targetGrams,
      recoveryTip: postWorkoutRecommendation.tip,
      completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Gym Workout</h2>
              <p className="text-[11px] text-slate-400">Track workout intensity & post-workout recovery</p>
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Workout Split Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Workout Split / Target:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORKOUT_SPLITS.map((split) => (
                <button
                  key={split.id}
                  type="button"
                  onClick={() => setSelectedSplit(split.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedSplit === split.id
                      ? "bg-amber-500/20 border-amber-500/50 text-white shadow-md shadow-amber-500/10"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-base">{split.icon}</div>
                  <div className="text-xs font-bold mt-1 truncate">{split.name.split("(")[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Anabolic Recovery Protein Insight */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-850 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Post-Workout Target:</span>
                <span className="text-emerald-400 font-black">{postWorkoutRecommendation.rangeText}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {postWorkoutRecommendation.tip}
              </p>
            </div>
          </div>

          {/* Session Duration & Intensity */}
          <div className="grid grid-cols-2 gap-3 bg-slate-850/60 border border-slate-800 rounded-2xl p-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-amber-400" /> Duration:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="10"
                  max="240"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(10, Number(e.target.value) || 10))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-white text-center"
                />
                <span className="text-xs text-slate-400">minutes</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                <Flame className="w-3 h-3 text-orange-400" /> Burn Estimate:
              </label>
              <div className="text-sm font-black text-amber-400">
                ~{estimatedCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
            </div>
          </div>

          {/* Exercises Logged */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
              <span>Exercises Completed ({exercises.length})</span>
            </div>

            <div className="space-y-2">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{ex.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Sets: <strong className="text-slate-200">{ex.sets}</strong></span>
                      <span>Reps: <strong className="text-slate-200">{ex.reps}</strong></span>
                      {ex.weightKg > 0 && <span>Weight: <strong className="text-cyan-400">{ex.weightKg}kg</strong></span>}
                    </div>
                  </div>

                  {/* Edit Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[11px]">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExercise(idx, "sets", e.target.value)}
                        className="w-9 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-white"
                        title="Sets"
                      />
                      <span className="text-slate-500">×</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExercise(idx, "reps", e.target.value)}
                        className="w-11 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-white"
                        title="Reps"
                      />
                      <span className="text-slate-500">@</span>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={ex.weightKg}
                        onChange={(e) => handleUpdateExercise(idx, "weightKg", e.target.value)}
                        className="w-12 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-cyan-300 font-bold"
                        title="Weight in kg"
                      />
                      <span className="text-[10px] text-slate-400">kg</span>
                    </div>

                    <button
                      onClick={() => handleRemoveExercise(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Exercise Dropdown */}
            <div className="pt-1">
              <select
                value={newExerciseId}
                onChange={(e) => {
                  if (e.target.value) handleAddExercise(e.target.value);
                }}
                className="w-full bg-slate-800 border border-dashed border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="">+ Add an Exercise to this Workout...</option>
                {availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscle})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Save Workout & Activate Recovery
          </button>
        </div>
      </div>
    </div>
  );
}
