import React, { useState } from "react";
import { X, Save, Key, Scale, Target, Sparkles, AlertTriangle, ExternalLink, Eye, EyeOff } from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearDayData
}) {
  const [weightKg, setWeightKg] = useState(settings.weightKg || 70);
  const [weightUnit, setWeightUnit] = useState(settings.weightUnit || "kg");
  const [fitnessGoal, setFitnessGoal] = useState(settings.fitnessGoal || "muscle_gain");
  const [customTarget, setCustomTarget] = useState(settings.targetProtein || 150);
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || "");
  const [usdaApiKey, setUsdaApiKey] = useState(settings.usdaApiKey || "");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  // Calculate recommended protein based on weight in kg
  const effectiveWeightKg = weightUnit === "lbs" ? weightKg * 0.453592 : weightKg;
  let multiplier = 2.0;
  if (fitnessGoal === "muscle_gain") multiplier = 2.2;
  if (fitnessGoal === "fat_loss") multiplier = 2.3;
  if (fitnessGoal === "maintenance") multiplier = 1.8;

  const calculatedTarget = Math.round(effectiveWeightKg * multiplier);

  const handleSave = () => {
    const finalTarget = fitnessGoal === "custom" ? Number(customTarget) : calculatedTarget;
    onSaveSettings({
      weightKg: Number(weightKg),
      weightUnit,
      fitnessGoal,
      targetProtein: Math.max(20, Math.min(400, finalTarget)),
      geminiApiKey: geminiApiKey.trim(),
      usdaApiKey: usdaApiKey.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Settings & Target Calculator</h2>
              <p className="text-[11px] text-slate-400">Personalize your protein goals & AI keys</p>
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Section 1: Body Weight & Fitness Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-cyan-400" /> Your Body Weight:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 0))}
                  className="w-20 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
                />
                <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setWeightUnit("kg")}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      weightUnit === "kg" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit("lbs")}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      weightUnit === "lbs" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>

            {/* Fitness Goal Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" /> Training & Nutrition Goal:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "muscle_gain", label: "Muscle Gain / Hypertrophy", desc: "2.2g / kg (High synthesis)", icon: "💪" },
                  { id: "fat_loss", label: "Lean Cut / Fat Loss", desc: "2.3g / kg (Muscle sparing)", icon: "🔥" },
                  { id: "maintenance", label: "Athletic Maintenance", desc: "1.8g / kg (Optimal recovery)", icon: "⚡" },
                  { id: "custom", label: "Custom Target", desc: "Set your own grams", icon: "🎯" }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFitnessGoal(g.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      fitnessGoal === g.id
                        ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="text-base">{g.icon}</div>
                    <div className="text-xs font-bold mt-1">{g.label}</div>
                    <div className="text-[10px] text-slate-400">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Calculated Target Display */}
            {fitnessGoal !== "custom" ? (
              <div className="bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Recommended Daily Target
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Based on your weight & fitness goal
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {calculatedTarget} <span className="text-xs text-slate-400 font-semibold">g/day</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-850 border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Set Custom Protein Target:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="30"
                    max="400"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(Math.max(10, Number(e.target.value) || 0))}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center text-sm font-bold text-white"
                  />
                  <span className="text-xs text-slate-400 font-bold">g/day</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Google Gemini Vision API Key */}
          <div className="bg-slate-850/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Google Gemini Vision Key (AI Photo Scanner):
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 underline"
              >
                Get Free Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              Optional: Google AI Studio provides 100% free Gemini 1.5 Flash keys. Your key is stored securely only on your device in <code className="text-cyan-300">localStorage</code>.
            </p>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Section 3: Reset Data */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400">Reset Today's Log</div>
              <div className="text-[10px] text-slate-500">Clears meals & workouts for the active date</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear today's meals and workout log?")) {
                  onClearDayData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors"
            >
              Clear Log
            </button>
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
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
          >
            <Save className="w-4 h-4 stroke-[3]" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
