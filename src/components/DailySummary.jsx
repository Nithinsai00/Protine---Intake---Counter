import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Zap, CheckCircle2, Flame, AlertCircle } from "lucide-react";

export default function DailySummary({
  totalProtein,
  targetProtein,
  totalCalories,
  totalCarbs,
  totalFat,
  todaysWorkout,
  onOpenWorkout
}) {
  const progressPercent = Math.min(100, Math.round((totalProtein / (targetProtein || 1)) * 100));
  const remaining = Math.max(0, Math.round((targetProtein - totalProtein) * 10) / 10);
  const isGoalReached = totalProtein >= targetProtein && targetProtein > 0;
  const prevReachedRef = useRef(false);

  // Trigger confetti only once when goal is hit
  useEffect(() => {
    if (isGoalReached && !prevReachedRef.current) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#10b981", "#3b82f6", "#f59e0b"]
      });
      prevReachedRef.current = true;
    } else if (!isGoalReached) {
      prevReachedRef.current = false;
    }
  }, [isGoalReached]);

  // SVG circular gauge math
  const radius = 68;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <section className="bg-gradient-to-b from-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Interactive Circular Progress Ring */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg height="144" width="144" className="transform -rotate-90">
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="72"
                cy="72"
              />
              <circle
                stroke="url(#proteinGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{
                  strokeDashoffset,
                  transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="72"
                cy="72"
              />
              <defs>
                <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Info */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tight">
                {Math.round(totalProtein)}
                <span className="text-xs font-semibold text-cyan-400 ml-0.5">g</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                of {targetProtein}g
              </span>
              <span className="text-[10px] font-bold text-emerald-400 mt-0.5">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Protein Summary Text */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Daily Target
            </div>
            
            {isGoalReached ? (
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 inline" /> Goal Achieved!
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Optimal protein intake achieved for muscle recovery & growth! 🔥
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  <span className="text-cyan-400">{remaining}g</span> remaining
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Keep fueling your body to trigger muscle protein synthesis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Macro & Workout Insight Cards */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {/* Secondary Macros Card */}
          <div className="bg-slate-800/70 backdrop-blur border border-slate-700/60 rounded-2xl p-3.5 flex-1 min-w-[200px] flex justify-around items-center">
            <div className="text-center px-2">
              <div className="text-[11px] font-medium text-slate-400">Calories</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">{Math.round(totalCalories)}</div>
              <div className="text-[9px] text-slate-500">kcal</div>
            </div>
            <div className="h-8 w-px bg-slate-700/60"></div>
            <div className="text-center px-2">
              <div className="text-[11px] font-medium text-slate-400">Carbs</div>
              <div className="text-base font-bold text-blue-400 mt-0.5">{Math.round(totalCarbs)}g</div>
              <div className="text-[9px] text-slate-500">energy</div>
            </div>
            <div className="h-8 w-px bg-slate-700/60"></div>
            <div className="text-center px-2">
              <div className="text-[11px] font-medium text-slate-400">Fats</div>
              <div className="text-base font-bold text-purple-400 mt-0.5">{Math.round(totalFat)}g</div>
              <div className="text-[9px] text-slate-500">hormones</div>
            </div>
          </div>

          {/* Anabolic Workout Status Card */}
          {todaysWorkout ? (
            <div 
              onClick={onOpenWorkout}
              className="cursor-pointer bg-gradient-to-r from-emerald-950/50 to-slate-850 border border-emerald-500/30 rounded-2xl p-3.5 flex-1 min-w-[220px] flex items-center gap-3 hover:border-emerald-400/50 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xl font-bold">
                {todaysWorkout.icon || "🏋️"}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Recovery Active
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {todaysWorkout.splitName || "Workout Completed"}
                </div>
                <div className="text-[10px] text-slate-400">
                  Target 30-40g protein post-session
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenWorkout}
              className="bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-cyan-500/40 rounded-2xl p-3.5 flex-1 min-w-[200px] flex items-center justify-center gap-2.5 text-slate-300 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">Log Gym Workout</div>
                <div className="text-[10px] text-slate-400">Unlock post-workout protein timing</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
