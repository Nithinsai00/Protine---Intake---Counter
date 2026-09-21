import React from "react";
import { Flame, ChevronLeft, ChevronRight, Settings, Dumbbell } from "lucide-react";

export default function Header({ selectedDate, setSelectedDate, streak, onOpenSettings }) {
  const isToday = new Date().toISOString().slice(0, 10) === selectedDate;

  const handleDateChange = (offset) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + offset);
    setSelectedDate(curr.toISOString().slice(0, 10));
  };

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl tracking-wider">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ProPulse
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Dumbbell className="w-3 h-3 text-emerald-400 inline" /> Smart Protein & Gym Hub
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 shadow-inner">
          <button
            onClick={() => handleDateChange(-1)}
            aria-label="Previous day"
            className="p-1.5 hover:bg-slate-700/60 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 text-xs font-semibold text-center min-w-[100px]">
            <span className={isToday ? "text-cyan-400 font-bold" : "text-slate-200"}>
              {isToday ? "Today" : formattedDate}
            </span>
            <div className="text-[10px] text-slate-400 font-normal">
              {isToday ? formattedDate : ""}
            </div>
          </div>
          <button
            onClick={() => handleDateChange(1)}
            aria-label="Next day"
            className="p-1.5 hover:bg-slate-700/60 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Streak & Settings */}
        <div className="flex items-center gap-2">
          <div 
            title="Consistent days meeting protein target" 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold"
          >
            <Flame className="w-4 h-4 fill-amber-400 animate-pulse text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
