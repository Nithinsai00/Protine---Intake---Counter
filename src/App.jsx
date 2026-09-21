import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import DailySummary from "./components/DailySummary";
import ActionCards from "./components/ActionCards";
import FoodLogList from "./components/FoodLogList";
import WorkoutLogList from "./components/WorkoutLogList";
import FoodSearchModal from "./components/FoodSearchModal";
import PhotoAiModal from "./components/PhotoAiModal";
import BarcodeScannerModal from "./components/BarcodeScannerModal";
import WorkoutModal from "./components/WorkoutModal";
import SettingsModal from "./components/SettingsModal";
import Navigation from "./components/Navigation";

// Initial default settings
const DEFAULT_SETTINGS = {
  weightKg: 72,
  weightUnit: "kg",
  fitnessGoal: "muscle_gain",
  targetProtein: 155,
  geminiApiKey: "",
  usdaApiKey: ""
};

// Initial demo log if user opens for the first time
const getInitialDemoData = (todayStr) => ({
  [todayStr]: {
    foods: [
      {
        id: "demo-food-1",
        name: "Boiled Eggs (3 Large)",
        portionGrams: 150,
        proteinGrams: 18.9,
        calories: 232,
        carbs: 1.6,
        fat: 15.9,
        mealCategory: "Breakfast",
        icon: "🥚",
        source: "Staple",
        timestamp: "08:30 AM"
      },
      {
        id: "demo-food-2",
        name: "Whey Protein Isolate Shake",
        portionGrams: 35,
        proteinGrams: 28.0,
        calories: 130,
        carbs: 1.5,
        fat: 0.8,
        mealCategory: "Post-Workout",
        icon: "🥤",
        source: "Staple",
        timestamp: "11:15 AM"
      }
    ],
    workout: {
      id: "demo-workout-1",
      splitId: "push",
      splitName: "Push (Chest, Shoulders, Triceps)",
      icon: "💪",
      durationMinutes: 50,
      intensity: "moderate",
      caloriesBurned: 325,
      totalVolumeKg: 3420,
      recommendedProtein: 30,
      recoveryTip: "Consume fast-digesting protein with carbs within 2 hours for optimal muscle protein synthesis (MPS).",
      completedAt: "10:45 AM",
      exercises: [
        { id: "bench-press", name: "Barbell Bench Press", sets: 3, reps: 8, weightKg: 65 },
        { id: "incline-db-press", name: "Incline Dumbbell Press", sets: 3, reps: 10, weightKg: 22 },
        { id: "tricep-pushdown", name: "Cable Tricep Rope Pushdown", sets: 3, reps: 12, weightKg: 25 }
      ]
    }
  }
});

export default function App() {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Persistent state in localStorage
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState("overview");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("propulse_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [dailyLogs, setDailyLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("propulse_daily_logs");
      return saved ? JSON.parse(saved) : getInitialDemoData(todayStr);
    } catch {
      return getInitialDemoData(todayStr);
    }
  });

  // Modals visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPhotoAiOpen, setIsPhotoAiOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("propulse_settings", JSON.stringify(settings));
    } catch (err) {
      console.warn("Failed to persist settings:", err);
    }
  }, [settings]);

  // Sync daily logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("propulse_daily_logs", JSON.stringify(dailyLogs));
    } catch (err) {
      console.warn("Failed to persist logs:", err);
    }
  }, [dailyLogs]);

  // Active day data
  const currentDayData = dailyLogs[selectedDate] || { foods: [], workout: null };
  const currentFoods = currentDayData.foods || [];
  const currentWorkout = currentDayData.workout || null;

  // Macros calculations
  const totalProtein = currentFoods.reduce((sum, f) => sum + (Number(f.proteinGrams) || 0), 0);
  const totalCalories = currentFoods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const totalCarbs = currentFoods.reduce((sum, f) => sum + (Number(f.carbs) || 0), 0);
  const totalFat = currentFoods.reduce((sum, f) => sum + (Number(f.fat) || 0), 0);

  // Calculate consistency streak
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayFoods = dailyLogs[key]?.foods || [];
      const dayProtein = dayFoods.reduce((sum, f) => sum + (Number(f.proteinGrams) || 0), 0);
      if (dayProtein >= settings.targetProtein * 0.8) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return Math.max(1, count);
  }, [dailyLogs, settings.targetProtein]);

  // Food handlers
  const handleAddFood = (newFood) => {
    setDailyLogs((prev) => {
      const day = prev[selectedDate] || { foods: [], workout: null };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          foods: [newFood, ...(day.foods || [])]
        }
      };
    });
  };

  const handleDeleteFood = (foodId) => {
    setDailyLogs((prev) => {
      const day = prev[selectedDate] || { foods: [], workout: null };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          foods: (day.foods || []).filter((f) => f.id !== foodId)
        }
      };
    });
  };

  // Workout handlers
  const handleSaveWorkout = (workoutData) => {
    setDailyLogs((prev) => {
      const day = prev[selectedDate] || { foods: [], workout: null };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          workout: workoutData
        }
      };
    });
  };

  const handleDeleteWorkout = () => {
    setDailyLogs((prev) => {
      const day = prev[selectedDate] || { foods: [], workout: null };
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          workout: null
        }
      };
    });
  };

  const handleClearDayData = () => {
    setDailyLogs((prev) => ({
      ...prev,
      [selectedDate]: { foods: [], workout: null }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 pb-20 sm:pb-12">
      {/* Top Header */}
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        streak={streak}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4">
        {/* Responsive Tabs Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === "settings") {
              setIsSettingsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          foodCount={currentFoods.length}
          hasWorkout={!!currentWorkout}
        />

        {/* Daily Protein & Macro Summary Progress Gauge */}
        <DailySummary
          totalProtein={totalProtein}
          targetProtein={settings.targetProtein}
          totalCalories={totalCalories}
          totalCarbs={totalCarbs}
          totalFat={totalFat}
          todaysWorkout={currentWorkout}
          onOpenWorkout={() => setIsWorkoutOpen(true)}
        />

        {/* Quick-Action Logging Cards */}
        <ActionCards
          onOpenPhotoAi={() => setIsPhotoAiOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBarcode={() => setIsBarcodeOpen(true)}
          onOpenWorkout={() => setIsWorkoutOpen(true)}
        />

        {/* Content according to Active Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <FoodLogList
              foods={currentFoods}
              onDeleteFood={handleDeleteFood}
              onOpenPhotoAi={() => setIsPhotoAiOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            <WorkoutLogList
              workout={currentWorkout}
              onOpenWorkout={() => setIsWorkoutOpen(true)}
              onDeleteWorkout={handleDeleteWorkout}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          </div>
        )}

        {activeTab === "foods" && (
          <FoodLogList
            foods={currentFoods}
            onDeleteFood={handleDeleteFood}
            onOpenPhotoAi={() => setIsPhotoAiOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {activeTab === "workouts" && (
          <WorkoutLogList
            workout={currentWorkout}
            onOpenWorkout={() => setIsWorkoutOpen(true)}
            onDeleteWorkout={handleDeleteWorkout}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}
      </main>

      {/* Modal Dialogs */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddFood={handleAddFood}
        usdaApiKey={settings.usdaApiKey}
      />

      <PhotoAiModal
        isOpen={isPhotoAiOpen}
        onClose={() => setIsPhotoAiOpen(false)}
        onAddFood={handleAddFood}
        geminiApiKey={settings.geminiApiKey}
        onOpenSettings={() => {
          setIsPhotoAiOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onAddFood={handleAddFood}
      />

      <WorkoutModal
        isOpen={isWorkoutOpen}
        onClose={() => setIsWorkoutOpen(false)}
        onSaveWorkout={handleSaveWorkout}
        existingWorkout={currentWorkout}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onClearDayData={handleClearDayData}
      />
    </div>
  );
}
