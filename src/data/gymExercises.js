// Gym exercises and workout split definitions

export const WORKOUT_SPLITS = [
  { id: "push", name: "Push (Chest, Shoulders, Triceps)", icon: "💪" },
  { id: "pull", name: "Pull (Back, Biceps, Rear Delts)", icon: "🏋️‍♂️" },
  { id: "legs", name: "Legs (Quads, Hamstrings, Glutes, Calves)", icon: "🦵" },
  { id: "upper", name: "Upper Body Hypertrophy", icon: "💥" },
  { id: "lower", name: "Lower Body & Core", icon: "⚡" },
  { id: "full_body", name: "Full Body Strength", icon: "🔥" },
  { id: "cardio_hiit", name: "Cardio & HIIT Conditioning", icon: "🏃‍♂️" }
];

export const GYM_EXERCISES = [
  // Chest
  { id: "bench-press", name: "Barbell Bench Press", muscle: "Chest", split: "push", defaultSets: 3, defaultReps: 8 },
  { id: "incline-db-press", name: "Incline Dumbbell Press", muscle: "Upper Chest", split: "push", defaultSets: 3, defaultReps: 10 },
  { id: "cable-crossover", name: "Cable Chest Flyes", muscle: "Chest", split: "push", defaultSets: 3, defaultReps: 12 },
  { id: "pushups", name: "Push-ups (Weighted / Bodyweight)", muscle: "Chest", split: "push", defaultSets: 3, defaultReps: 15 },
  { id: "dips-chest", name: "Parallel Bar Dips", muscle: "Chest / Triceps", split: "push", defaultSets: 3, defaultReps: 10 },

  // Back
  { id: "deadlift", name: "Conventional Deadlift", muscle: "Posterior Chain / Back", split: "pull", defaultSets: 3, defaultReps: 5 },
  { id: "pullups", name: "Pull-ups / Chin-ups", muscle: "Lats & Biceps", split: "pull", defaultSets: 3, defaultReps: 8 },
  { id: "barbell-row", name: "Barbell Bent-Over Row", muscle: "Upper Back & Lats", split: "pull", defaultSets: 3, defaultReps: 8 },
  { id: "lat-pulldown", name: "Cable Lat Pulldown", muscle: "Lats", split: "pull", defaultSets: 3, defaultReps: 10 },
  { id: "seated-cable-row", name: "Seated Cable Row", muscle: "Mid Back", split: "pull", defaultSets: 3, defaultReps: 12 },
  { id: "face-pulls", name: "Cable Face Pulls", muscle: "Rear Delts & Traps", split: "pull", defaultSets: 3, defaultReps: 15 },

  // Legs
  { id: "barbell-squat", name: "Barbell Back Squat", muscle: "Quads & Glutes", split: "legs", defaultSets: 3, defaultReps: 8 },
  { id: "leg-press", name: "Leg Press Machine", muscle: "Quads", split: "legs", defaultSets: 3, defaultReps: 12 },
  { id: "romanian-deadlift", name: "Romanian Deadlift (RDL)", muscle: "Hamstrings & Glutes", split: "legs", defaultSets: 3, defaultReps: 10 },
  { id: "walking-lunges", name: "Dumbbell Walking Lunges", muscle: "Quads & Glutes", split: "legs", defaultSets: 3, defaultReps: 12 },
  { id: "leg-curls", name: "Lying / Seated Leg Curls", muscle: "Hamstrings", split: "legs", defaultSets: 3, defaultReps: 12 },
  { id: "calf-raises", name: "Standing Calf Raises", muscle: "Calves", split: "legs", defaultSets: 4, defaultReps: 15 },

  // Shoulders
  { id: "overhead-press", name: "Overhead Barbell Military Press", muscle: "Shoulders", split: "push", defaultSets: 3, defaultReps: 8 },
  { id: "db-lateral-raise", name: "Dumbbell Lateral Raises", muscle: "Side Delts", split: "push", defaultSets: 4, defaultReps: 15 },
  { id: "arnold-press", name: "Arnold Dumbbell Press", muscle: "Shoulders", split: "push", defaultSets: 3, defaultReps: 10 },

  // Arms
  { id: "barbell-curl", name: "Barbell Bicep Curls", muscle: "Biceps", split: "pull", defaultSets: 3, defaultReps: 10 },
  { id: "hammer-curls", name: "Dumbbell Hammer Curls", muscle: "Biceps & Forearms", split: "pull", defaultSets: 3, defaultReps: 12 },
  { id: "tricep-pushdown", name: "Cable Tricep Rope Pushdown", muscle: "Triceps", split: "push", defaultSets: 3, defaultReps: 12 },
  { id: "skull-crushers", name: "EZ-Bar Skull Crushers", muscle: "Triceps", split: "push", defaultSets: 3, defaultReps: 10 },

  // Core & Cardio
  { id: "plank", name: "Forearm Plank", muscle: "Core", split: "full_body", defaultSets: 3, defaultReps: 60, unit: "seconds" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raises", muscle: "Abs", split: "full_body", defaultSets: 3, defaultReps: 12 },
  { id: "hiit-sprints", name: "Treadmill HIIT Sprints", muscle: "Cardiovascular", split: "cardio_hiit", defaultSets: 8, defaultReps: 30, unit: "seconds" },
  { id: "rowing-machine", name: "Ergometer Rowing", muscle: "Full Body Cardio", split: "cardio_hiit", defaultSets: 3, defaultReps: 500, unit: "meters" }
];

export function getRecommendedPostWorkoutProtein(workoutType, durationMinutes = 45) {
  if (workoutType === "legs" || workoutType === "full_body") {
    return {
      targetGrams: 35,
      rangeText: "30 - 40g",
      urgency: "High (Large muscle group breakdown)",
      tip: "Consume fast-digesting protein (whey or egg whites) with complex carbs within 2 hours for optimal muscle protein synthesis (MPS)."
    };
  }
  if (workoutType === "cardio_hiit") {
    return {
      targetGrams: 25,
      rangeText: "20 - 25g",
      urgency: "Moderate (Recovery & glycogen restoration)",
      tip: "Pair protein with electrolytes and carbohydrates to replenish depleted glycogen stores."
    };
  }
  return {
    targetGrams: 30,
    rangeText: "25 - 35g",
    urgency: "Optimal",
    tip: "Aim for a high leucine protein source (whey, chicken, or tofu) within 90-120 minutes post-training."
  };
}
