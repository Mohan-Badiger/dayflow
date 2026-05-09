// Complete exercise library with all categories
export const EXERCISE_LIBRARY = [
  // ── CHEST ──
  { name: "Push-ups", slug: "push-ups", category: "chest", environment: "anywhere", difficulty: "beginner", muscleGroups: ["chest","triceps","shoulders"], equipment: "none", defaultSets: 3, defaultReps: "15", defaultRestSec: 60, caloriesPerMin: 7, icon: "💪", isPopular: true, instructions: "Keep body straight, lower chest to floor, push back up." },
  { name: "Bench Press", slug: "bench-press", category: "chest", environment: "gym", difficulty: "intermediate", muscleGroups: ["chest","triceps","shoulders"], equipment: "barbell", defaultSets: 4, defaultReps: "10", defaultRestSec: 90, caloriesPerMin: 6, icon: "🏋️", isPopular: true, instructions: "Lie on bench, grip bar shoulder-width, lower to chest, press up." },
  { name: "Incline Dumbbell Press", slug: "incline-db-press", category: "chest", environment: "gym", difficulty: "intermediate", muscleGroups: ["upper chest","shoulders"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 75, caloriesPerMin: 6, icon: "🏋️", instructions: "Set bench to 30-45°, press dumbbells up from chest level." },
  { name: "Chest Flyes", slug: "chest-flyes", category: "chest", environment: "gym", difficulty: "intermediate", muscleGroups: ["chest"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 5, icon: "🦋", instructions: "Lie flat, arms wide with slight bend, bring dumbbells together above chest." },
  { name: "Diamond Push-ups", slug: "diamond-pushups", category: "chest", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["chest","triceps"], equipment: "none", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 7, icon: "💎", instructions: "Hands together forming diamond shape, lower chest to hands." },
  { name: "Cable Crossover", slug: "cable-crossover", category: "chest", environment: "gym", difficulty: "advanced", muscleGroups: ["chest"], equipment: "cable machine", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 5, icon: "🔗", instructions: "Stand between cables, bring handles together in front with slight bend in elbows." },

  // ── BACK ──
  { name: "Pull-ups", slug: "pull-ups", category: "back", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["lats","biceps","upper back"], equipment: "pull-up bar", defaultSets: 3, defaultReps: "8", defaultRestSec: 90, caloriesPerMin: 8, icon: "🔝", isPopular: true, instructions: "Hang from bar, pull chin above bar, lower controlled." },
  { name: "Deadlift", slug: "deadlift", category: "back", environment: "gym", difficulty: "advanced", muscleGroups: ["lower back","hamstrings","glutes","traps"], equipment: "barbell", defaultSets: 4, defaultReps: "6", defaultRestSec: 120, caloriesPerMin: 9, icon: "🏋️", isPopular: true, instructions: "Hinge at hips, grip bar, drive through heels to stand." },
  { name: "Bent Over Row", slug: "bent-over-row", category: "back", environment: "gym", difficulty: "intermediate", muscleGroups: ["lats","rhomboids","biceps"], equipment: "barbell", defaultSets: 4, defaultReps: "10", defaultRestSec: 90, caloriesPerMin: 7, icon: "🚣", instructions: "Hinge forward 45°, pull bar to lower chest, squeeze shoulder blades." },
  { name: "Lat Pulldown", slug: "lat-pulldown", category: "back", environment: "gym", difficulty: "beginner", muscleGroups: ["lats","biceps"], equipment: "cable machine", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 5, icon: "⬇️", instructions: "Pull bar to upper chest, squeeze lats, return slowly." },
  { name: "Superman Hold", slug: "superman-hold", category: "back", environment: "anywhere", difficulty: "beginner", muscleGroups: ["lower back","glutes"], equipment: "none", defaultSets: 3, defaultReps: "30s", defaultRestSec: 45, caloriesPerMin: 4, icon: "🦸", instructions: "Lie face down, lift arms and legs simultaneously, hold." },
  { name: "Single Arm Dumbbell Row", slug: "single-arm-row", category: "back", environment: "gym", difficulty: "intermediate", muscleGroups: ["lats","rhomboids","biceps"], equipment: "dumbbell", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 6, icon: "💪", instructions: "One knee on bench, pull dumbbell to hip, squeeze back." },

  // ── SHOULDERS ──
  { name: "Overhead Press", slug: "overhead-press", category: "shoulders", environment: "gym", difficulty: "intermediate", muscleGroups: ["shoulders","triceps"], equipment: "barbell", defaultSets: 4, defaultReps: "8", defaultRestSec: 90, caloriesPerMin: 6, icon: "🏋️", isPopular: true, instructions: "Press bar overhead from shoulder level, lock out arms." },
  { name: "Lateral Raises", slug: "lateral-raises", category: "shoulders", environment: "anywhere", difficulty: "beginner", muscleGroups: ["side delts"], equipment: "dumbbells", defaultSets: 3, defaultReps: "15", defaultRestSec: 45, caloriesPerMin: 4, icon: "🦅", isPopular: true, instructions: "Raise dumbbells to sides until parallel with floor." },
  { name: "Front Raises", slug: "front-raises", category: "shoulders", environment: "anywhere", difficulty: "beginner", muscleGroups: ["front delts"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 45, caloriesPerMin: 4, icon: "⬆️", instructions: "Raise dumbbells in front to eye level, lower slowly." },
  { name: "Face Pulls", slug: "face-pulls", category: "shoulders", environment: "gym", difficulty: "beginner", muscleGroups: ["rear delts","traps"], equipment: "cable machine", defaultSets: 3, defaultReps: "15", defaultRestSec: 45, caloriesPerMin: 4, icon: "🎯", instructions: "Pull rope to face, externally rotate shoulders at top." },
  { name: "Pike Push-ups", slug: "pike-pushups", category: "shoulders", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["shoulders","triceps"], equipment: "none", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 6, icon: "⛰️", instructions: "Form inverted V, bend elbows to lower head towards ground." },
  { name: "Arnold Press", slug: "arnold-press", category: "shoulders", environment: "gym", difficulty: "intermediate", muscleGroups: ["shoulders"], equipment: "dumbbells", defaultSets: 3, defaultReps: "10", defaultRestSec: 75, caloriesPerMin: 5, icon: "🏆", instructions: "Start palms facing you, rotate and press overhead." },

  // ── ARMS ──
  { name: "Bicep Curls", slug: "bicep-curls", category: "arms", environment: "anywhere", difficulty: "beginner", muscleGroups: ["biceps"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 45, caloriesPerMin: 4, icon: "💪", isPopular: true, instructions: "Curl dumbbells up, squeeze biceps, lower controlled." },
  { name: "Tricep Dips", slug: "tricep-dips", category: "arms", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["triceps","chest"], equipment: "bench/chair", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 6, icon: "🪑", isPopular: true, instructions: "Lower body by bending elbows, push back up." },
  { name: "Hammer Curls", slug: "hammer-curls", category: "arms", environment: "anywhere", difficulty: "beginner", muscleGroups: ["biceps","forearms"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 45, caloriesPerMin: 4, icon: "🔨", instructions: "Curl with neutral grip (palms facing each other)." },
  { name: "Skull Crushers", slug: "skull-crushers", category: "arms", environment: "gym", difficulty: "intermediate", muscleGroups: ["triceps"], equipment: "EZ bar", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 5, icon: "💀", instructions: "Lower bar to forehead, extend arms to press up." },
  { name: "Concentration Curls", slug: "concentration-curls", category: "arms", environment: "anywhere", difficulty: "beginner", muscleGroups: ["biceps"], equipment: "dumbbell", defaultSets: 3, defaultReps: "12", defaultRestSec: 45, caloriesPerMin: 4, icon: "🎯", instructions: "Elbow on inner thigh, curl dumbbell, squeeze at top." },
  { name: "Tricep Pushdown", slug: "tricep-pushdown", category: "arms", environment: "gym", difficulty: "beginner", muscleGroups: ["triceps"], equipment: "cable machine", defaultSets: 3, defaultReps: "12", defaultRestSec: 45, caloriesPerMin: 4, icon: "⬇️", instructions: "Push cable bar down, extend arms fully, squeeze triceps." },

  // ── LEGS ──
  { name: "Squats", slug: "squats", category: "legs", environment: "anywhere", difficulty: "beginner", muscleGroups: ["quads","glutes","hamstrings"], equipment: "none", defaultSets: 4, defaultReps: "15", defaultRestSec: 60, caloriesPerMin: 8, icon: "🦵", isPopular: true, instructions: "Feet shoulder-width, sit back and down, drive through heels." },
  { name: "Barbell Squats", slug: "barbell-squats", category: "legs", environment: "gym", difficulty: "intermediate", muscleGroups: ["quads","glutes","hamstrings","core"], equipment: "barbell", defaultSets: 4, defaultReps: "8", defaultRestSec: 120, caloriesPerMin: 9, icon: "🏋️", isPopular: true, instructions: "Bar on upper back, squat to parallel, drive up." },
  { name: "Lunges", slug: "lunges", category: "legs", environment: "anywhere", difficulty: "beginner", muscleGroups: ["quads","glutes","hamstrings"], equipment: "none", defaultSets: 3, defaultReps: "12 each", defaultRestSec: 60, caloriesPerMin: 7, icon: "🚶", instructions: "Step forward, lower back knee to ground, push back." },
  { name: "Leg Press", slug: "leg-press", category: "legs", environment: "gym", difficulty: "beginner", muscleGroups: ["quads","glutes"], equipment: "leg press machine", defaultSets: 4, defaultReps: "12", defaultRestSec: 90, caloriesPerMin: 7, icon: "🦿", instructions: "Feet shoulder-width on platform, press away, return controlled." },
  { name: "Romanian Deadlift", slug: "romanian-deadlift", category: "legs", environment: "gym", difficulty: "intermediate", muscleGroups: ["hamstrings","glutes","lower back"], equipment: "barbell", defaultSets: 3, defaultReps: "10", defaultRestSec: 90, caloriesPerMin: 7, icon: "🏋️", instructions: "Slight knee bend, hinge at hips, lower bar along legs." },
  { name: "Calf Raises", slug: "calf-raises", category: "legs", environment: "anywhere", difficulty: "beginner", muscleGroups: ["calves"], equipment: "none", defaultSets: 4, defaultReps: "20", defaultRestSec: 30, caloriesPerMin: 3, icon: "🦶", instructions: "Rise onto toes, squeeze calves, lower slowly." },
  { name: "Wall Sit", slug: "wall-sit", category: "legs", environment: "anywhere", difficulty: "beginner", muscleGroups: ["quads","glutes"], equipment: "none", defaultSets: 3, defaultReps: "45s", defaultRestSec: 60, caloriesPerMin: 5, icon: "🧱", instructions: "Back against wall, slide down to 90°, hold position." },
  { name: "Bulgarian Split Squat", slug: "bulgarian-split-squat", category: "legs", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["quads","glutes","hamstrings"], equipment: "bench", defaultSets: 3, defaultReps: "10 each", defaultRestSec: 75, caloriesPerMin: 7, icon: "🇧🇬", instructions: "Rear foot on bench, lower front knee to 90°, push up." },

  // ── SIX PACK (ABS & CORE) ──
  { name: "Crunches", slug: "crunches", category: "six-pack", environment: "anywhere", difficulty: "beginner", muscleGroups: ["abs"], equipment: "none", defaultSets: 4, defaultReps: "25", defaultRestSec: 30, caloriesPerMin: 5, icon: "🔥", instructions: "Lie on back, knees bent, curl shoulders towards ceiling." },
  { name: "Leg Raises", slug: "leg-raises", category: "six-pack", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["lower abs"], equipment: "none", defaultSets: 4, defaultReps: "15", defaultRestSec: 45, caloriesPerMin: 5, icon: "🦵", instructions: "Lie flat, lift legs to 90 degrees, lower slowly without touching floor." },
  { name: "Plank", slug: "plank", category: "six-pack", environment: "anywhere", difficulty: "beginner", muscleGroups: ["core"], equipment: "none", defaultSets: 3, defaultReps: "60s", defaultRestSec: 30, caloriesPerMin: 4, icon: "🧘", instructions: "Hold push-up position on forearms, keep back flat." },
  { name: "Russian Twists", slug: "russian-twists", category: "six-pack", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["obliques"], equipment: "none", defaultSets: 3, defaultReps: "30", defaultRestSec: 45, caloriesPerMin: 6, icon: "🌀", instructions: "Sit with legs elevated, twist torso to touch floor on each side." },
  { name: "Bicycle Crunches", slug: "bicycle-crunches", category: "six-pack", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["abs","obliques"], equipment: "none", defaultSets: 3, defaultReps: "20 each side", defaultRestSec: 45, caloriesPerMin: 7, icon: "🚲", instructions: "Alternate elbow to opposite knee in a pedaling motion." },
  { name: "Mountain Climbers", slug: "mountain-climbers", category: "six-pack", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["core","cardio"], equipment: "none", defaultSets: 3, defaultReps: "40s", defaultRestSec: 30, caloriesPerMin: 10, icon: "⛰️", instructions: "In plank, drive knees rapidly towards chest." },
  { name: "Hanging Leg Raise", slug: "hanging-leg-raise", category: "six-pack", environment: "gym", difficulty: "advanced", muscleGroups: ["lower abs"], equipment: "pull-up bar", defaultSets: 3, defaultReps: "12", defaultRestSec: 60, caloriesPerMin: 8, icon: "🔝", instructions: "Hang from bar, lift legs to parallel with floor." },
  { name: "V-Ups", slug: "v-ups", category: "six-pack", environment: "anywhere", difficulty: "advanced", muscleGroups: ["abs"], equipment: "none", defaultSets: 3, defaultReps: "15", defaultRestSec: 60, caloriesPerMin: 8, icon: "✌️", instructions: "Fold body into a V shape by lifting torso and legs simultaneously." },

  // ── CARDIO ──
  { name: "Jumping Jacks", slug: "jumping-jacks", category: "cardio", environment: "anywhere", difficulty: "beginner", muscleGroups: ["full body"], equipment: "none", defaultSets: 3, defaultReps: "45s", defaultRestSec: 30, caloriesPerMin: 10, icon: "⭐", isPopular: true, instructions: "Jump feet apart while raising arms, return to start." },
  { name: "Burpees", slug: "burpees", category: "cardio", environment: "anywhere", difficulty: "advanced", muscleGroups: ["full body"], equipment: "none", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 14, icon: "🔥", isPopular: true, instructions: "Squat, jump to plank, push-up, jump back, jump up." },
  { name: "Jump Rope", slug: "jump-rope", category: "cardio", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["calves","shoulders","cardio"], equipment: "jump rope", defaultSets: 3, defaultReps: "60s", defaultRestSec: 30, caloriesPerMin: 12, icon: "🪢", instructions: "Jump over rope with both feet, keep elbows close." },

  // ── STRETCHING ──
  { name: "Hamstring Stretch", slug: "hamstring-stretch", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["hamstrings"], equipment: "none", defaultSets: 2, defaultReps: "30s each", defaultRestSec: 15, caloriesPerMin: 2, icon: "🧘", instructions: "Reach for toes while keeping legs straight, hold stretch." },
  { name: "Child's Pose", slug: "childs-pose", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["back","shoulders","hips"], equipment: "none", defaultSets: 2, defaultReps: "45s", defaultRestSec: 15, caloriesPerMin: 1, icon: "🙏", instructions: "Kneel, sit back on heels, reach arms forward on floor." },
];

export const CATEGORIES = [
  { id: "all", label: "All", icon: "🔥", color: "#f59e0b" },
  { id: "six-pack", label: "Six Pack", icon: "💎", color: "#6366f1" },
  { id: "chest", label: "Chest", icon: "🫁", color: "#ef4444" },
  { id: "back", label: "Back", icon: "🔙", color: "#3b82f6" },
  { id: "shoulders", label: "Shoulders", icon: "🦅", color: "#8b5cf6" },
  { id: "arms", label: "Arms", icon: "💪", color: "#ec4899" },
  { id: "legs", label: "Legs", icon: "🦵", color: "#10b981" },
  { id: "cardio", label: "Cardio", icon: "❤️", color: "#ef4444" },
  { id: "stretching", label: "Stretch", icon: "🧘", color: "#14b8a6" },
];

export const ENVIRONMENTS = [
  { id: "all", label: "All", icon: "🌍" },
  { id: "gym", label: "Gym", icon: "🏢" },
  { id: "home", label: "Home", icon: "🏠" },
  { id: "anywhere", label: "Anywhere", icon: "📍" },
  { id: "outdoor", label: "Outdoor", icon: "🌳" },
];

export const DIFFICULTIES = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner", color: "#10b981" },
  { id: "intermediate", label: "Intermediate", color: "#f59e0b" },
  { id: "advanced", label: "Advanced", color: "#ef4444" },
];

export const WEEKLY_SCHEDULE = [
  { 
    day: "Monday", 
    title: "Chest & Upper Six-Pack", 
    focus: "Chest Power & Upper Abs",
    exercises: ["bench-press", "incline-db-press", "chest-flyes", "push-ups", "crunches", "plank"],
    description: "Start the week with a strong chest pump and upper ab isolation."
  },
  { 
    day: "Tuesday", 
    title: "Back & Core Stability", 
    focus: "Back Width & Lower Back",
    exercises: ["deadlift", "pull-ups", "bent-over-row", "lat-pulldown", "superman-hold", "mountain-climbers"],
    description: "Build a V-taper and a strong foundation for your core."
  },
  { 
    day: "Wednesday", 
    title: "Shoulders & Full Six-Pack", 
    focus: "Shoulder Boulders & Total Core",
    exercises: ["overhead-press", "lateral-raises", "arnold-press", "leg-raises", "bicycle-crunches", "russian-twists"],
    description: "Sculpt your shoulders and hit every part of your abs."
  },
  { 
    day: "Thursday", 
    title: "Leg Day & Lower Abs", 
    focus: "Leg Strength & Deep Core",
    exercises: ["barbell-squats", "leg-press", "romanian-deadlift", "lunges", "hanging-leg-raise", "plank"],
    description: "The hardest day. Power through legs and finish with lower ab control."
  },
  { 
    day: "Friday", 
    title: "Arms & Obliques", 
    focus: "Bicep/Tricep Pump & Side Abs",
    exercises: ["bicep-curls", "tricep-dips", "hammer-curls", "tricep-pushdown", "russian-twists", "mountain-climbers"],
    description: "Arms for the weekend and obliques for the definition."
  },
  { 
    day: "Saturday", 
    title: "Full Body & Six-Pack HIIT", 
    focus: "Burn & Shred",
    exercises: ["burpees", "kettlebell-swing", "jump-rope", "v-ups", "bicycle-crunches", "plank"],
    description: "High intensity to shred fat and make those abs pop."
  },
  { 
    day: "Sunday", 
    title: "Recovery & Stretching", 
    focus: "Mobility & Rest",
    exercises: ["hamstring-stretch", "childs-pose", "cat-cow", "pigeon-pose"],
    description: "Rest your muscles so they can grow. Focus on flexibility."
  }
];

export const PRESET_WORKOUTS = [
  { name: "Chest & Abs", category: "chest", icon: "🫁", exercises: ["bench-press","incline-db-press","crunches","plank"], durationMin: 45, environment: "gym" },
  { name: "Six Pack Shred", category: "six-pack", icon: "💎", exercises: ["crunches","leg-raises","bicycle-crunches","v-ups","mountain-climbers"], durationMin: 20, environment: "anywhere" },
  { name: "Home Full Body", category: "full-body", icon: "🏠", exercises: ["push-ups","squats","lunges","plank","burpees"], durationMin: 30, environment: "home" },
];
