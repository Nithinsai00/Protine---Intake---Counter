import React from "react";
import { LayoutDashboard, Utensils, Dumbbell, Settings, Sparkles } from "lucide-react";

export default function Navigation({ activeTab, setActiveTab, foodCount, hasWorkout }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "foods", label: "Food Diary", icon: Utensils, badge: foodCount > 0 ? foodCount : null },
    { id: "workouts", label: "Gym & Workouts", icon: Dumbbell, hasDot: hasWorkout },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <>
      {/* Mobile Sticky Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 sm:hidden px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                  isActive ? "text-cyan-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                  {tab.hasDot && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop / Tablet Navigation Pill Bar */}
      <div className="hidden sm:flex items-center justify-center my-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 flex gap-1 shadow-lg backdrop-blur">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? "bg-slate-950 text-emerald-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.hasDot && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
