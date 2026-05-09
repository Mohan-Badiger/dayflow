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

  // ── CORE ──
  { name: "Plank", slug: "plank", category: "core", environment: "anywhere", difficulty: "beginner", muscleGroups: ["core","shoulders"], equipment: "none", defaultSets: 3, defaultReps: "60s", defaultRestSec: 45, caloriesPerMin: 4, icon: "🧘", isPopular: true, instructions: "Forearms on ground, body straight, hold position." },
  { name: "Crunches", slug: "crunches", category: "core", environment: "anywhere", difficulty: "beginner", muscleGroups: ["abs"], equipment: "none", defaultSets: 3, defaultReps: "20", defaultRestSec: 30, caloriesPerMin: 5, icon: "🔥", instructions: "Hands behind head, curl shoulders off floor, squeeze abs." },
  { name: "Russian Twists", slug: "russian-twists", category: "core", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["obliques","abs"], equipment: "none", defaultSets: 3, defaultReps: "20", defaultRestSec: 45, caloriesPerMin: 5, icon: "🌀", instructions: "Sit with feet off floor, twist torso side to side." },
  { name: "Mountain Climbers", slug: "mountain-climbers", category: "core", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["core","shoulders","cardio"], equipment: "none", defaultSets: 3, defaultReps: "30s", defaultRestSec: 30, caloriesPerMin: 10, icon: "⛰️", isPopular: true, instructions: "Plank position, alternate driving knees to chest rapidly." },
  { name: "Leg Raises", slug: "leg-raises", category: "core", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["lower abs","hip flexors"], equipment: "none", defaultSets: 3, defaultReps: "15", defaultRestSec: 45, caloriesPerMin: 5, icon: "🦵", instructions: "Lie flat, raise legs to 90°, lower without touching floor." },
  { name: "Dead Bug", slug: "dead-bug", category: "core", environment: "anywhere", difficulty: "beginner", muscleGroups: ["core","hip flexors"], equipment: "none", defaultSets: 3, defaultReps: "12 each", defaultRestSec: 30, caloriesPerMin: 4, icon: "🪲", instructions: "Lie on back, extend opposite arm/leg, keep back flat." },
  { name: "Hanging Leg Raise", slug: "hanging-leg-raise", category: "core", environment: "gym", difficulty: "advanced", muscleGroups: ["lower abs","hip flexors"], equipment: "pull-up bar", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 6, icon: "🔝", instructions: "Hang from bar, raise legs to 90° or higher, lower controlled." },

  // ── CARDIO ──
  { name: "Jumping Jacks", slug: "jumping-jacks", category: "cardio", environment: "anywhere", difficulty: "beginner", muscleGroups: ["full body"], equipment: "none", defaultSets: 3, defaultReps: "45s", defaultRestSec: 30, caloriesPerMin: 10, icon: "⭐", isPopular: true, instructions: "Jump feet apart while raising arms, return to start." },
  { name: "Burpees", slug: "burpees", category: "cardio", environment: "anywhere", difficulty: "advanced", muscleGroups: ["full body"], equipment: "none", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 14, icon: "🔥", isPopular: true, instructions: "Squat, jump to plank, push-up, jump back, jump up." },
  { name: "High Knees", slug: "high-knees", category: "cardio", environment: "anywhere", difficulty: "beginner", muscleGroups: ["quads","core","cardio"], equipment: "none", defaultSets: 3, defaultReps: "30s", defaultRestSec: 30, caloriesPerMin: 11, icon: "🦵", instructions: "Run in place, driving knees to waist height." },
  { name: "Jump Rope", slug: "jump-rope", category: "cardio", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["calves","shoulders","cardio"], equipment: "jump rope", defaultSets: 3, defaultReps: "60s", defaultRestSec: 30, caloriesPerMin: 12, icon: "🪢", instructions: "Jump over rope with both feet, keep elbows close." },
  { name: "Treadmill Run", slug: "treadmill-run", category: "cardio", environment: "gym", difficulty: "beginner", muscleGroups: ["legs","cardio"], equipment: "treadmill", defaultSets: 1, defaultReps: "20min", defaultRestSec: 0, caloriesPerMin: 10, icon: "🏃", instructions: "Maintain steady pace, good posture, land midfoot." },
  { name: "Box Jumps", slug: "box-jumps", category: "cardio", environment: "gym", difficulty: "intermediate", muscleGroups: ["quads","glutes","calves"], equipment: "plyo box", defaultSets: 3, defaultReps: "10", defaultRestSec: 60, caloriesPerMin: 10, icon: "📦", instructions: "Swing arms, jump onto box, stand fully, step down." },
  { name: "Cycling", slug: "cycling", category: "cardio", environment: "gym", difficulty: "beginner", muscleGroups: ["quads","hamstrings","cardio"], equipment: "stationary bike", defaultSets: 1, defaultReps: "20min", defaultRestSec: 0, caloriesPerMin: 8, icon: "🚴", instructions: "Adjust seat height, maintain 80-100 RPM, control resistance." },

  // ── FULL BODY ──
  { name: "Turkish Get-Up", slug: "turkish-getup", category: "full-body", environment: "anywhere", difficulty: "advanced", muscleGroups: ["shoulders","core","legs"], equipment: "kettlebell", defaultSets: 3, defaultReps: "5 each", defaultRestSec: 90, caloriesPerMin: 8, icon: "🏋️", instructions: "From lying to standing while holding weight overhead." },
  { name: "Kettlebell Swing", slug: "kettlebell-swing", category: "full-body", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["glutes","hamstrings","core","shoulders"], equipment: "kettlebell", defaultSets: 3, defaultReps: "15", defaultRestSec: 60, caloriesPerMin: 12, icon: "🔔", isPopular: true, instructions: "Hinge at hips, swing kettlebell to shoulder height using hip drive." },
  { name: "Clean and Press", slug: "clean-press", category: "full-body", environment: "gym", difficulty: "advanced", muscleGroups: ["shoulders","legs","back","core"], equipment: "barbell", defaultSets: 4, defaultReps: "6", defaultRestSec: 120, caloriesPerMin: 10, icon: "🏋️", instructions: "Clean bar to shoulders, press overhead in one fluid motion." },
  { name: "Thrusters", slug: "thrusters", category: "full-body", environment: "gym", difficulty: "intermediate", muscleGroups: ["quads","shoulders","core"], equipment: "dumbbells", defaultSets: 3, defaultReps: "12", defaultRestSec: 75, caloriesPerMin: 10, icon: "🚀", instructions: "Front squat into overhead press in one movement." },
  { name: "Bear Crawl", slug: "bear-crawl", category: "full-body", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["shoulders","core","quads"], equipment: "none", defaultSets: 3, defaultReps: "30s", defaultRestSec: 45, caloriesPerMin: 9, icon: "🐻", instructions: "Crawl on hands and toes, knees hovering, opposite hand/foot." },

  // ── STRETCHING ──
  { name: "Hamstring Stretch", slug: "hamstring-stretch", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["hamstrings"], equipment: "none", defaultSets: 2, defaultReps: "30s each", defaultRestSec: 15, caloriesPerMin: 2, icon: "🧘", instructions: "Reach for toes while keeping legs straight, hold stretch." },
  { name: "Hip Flexor Stretch", slug: "hip-flexor-stretch", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["hip flexors","quads"], equipment: "none", defaultSets: 2, defaultReps: "30s each", defaultRestSec: 15, caloriesPerMin: 2, icon: "🧘", instructions: "Lunge position, push hips forward, feel stretch in front hip." },
  { name: "Child's Pose", slug: "childs-pose", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["back","shoulders","hips"], equipment: "none", defaultSets: 2, defaultReps: "45s", defaultRestSec: 15, caloriesPerMin: 1, icon: "🙏", instructions: "Kneel, sit back on heels, reach arms forward on floor." },
  { name: "Cat-Cow Stretch", slug: "cat-cow", category: "stretching", environment: "anywhere", difficulty: "beginner", muscleGroups: ["spine","core"], equipment: "none", defaultSets: 2, defaultReps: "10", defaultRestSec: 15, caloriesPerMin: 2, icon: "🐱", instructions: "All fours, alternate arching and rounding spine." },
  { name: "Pigeon Pose", slug: "pigeon-pose", category: "stretching", environment: "anywhere", difficulty: "intermediate", muscleGroups: ["glutes","hip flexors"], equipment: "none", defaultSets: 2, defaultReps: "30s each", defaultRestSec: 15, caloriesPerMin: 2, icon: "🕊️", instructions: "Front leg bent, back leg extended, fold forward." },
]

export const CATEGORIES = [
  { id: "all", label: "All", icon: "🔥", color: "#f59e0b" },
  { id: "chest", label: "Chest", icon: "🫁", color: "#ef4444" },
  { id: "back", label: "Back", icon: "🔙", color: "#3b82f6" },
  { id: "shoulders", label: "Shoulders", icon: "🦅", color: "#8b5cf6" },
  { id: "arms", label: "Arms", icon: "💪", color: "#ec4899" },
  { id: "legs", label: "Legs", icon: "🦵", color: "#10b981" },
  { id: "core", label: "Core", icon: "🔥", color: "#f97316" },
  { id: "cardio", label: "Cardio", icon: "❤️", color: "#ef4444" },
  { id: "full-body", label: "Full Body", icon: "🏋️", color: "#6366f1" },
  { id: "stretching", label: "Stretch", icon: "🧘", color: "#14b8a6" },
]

export const ENVIRONMENTS = [
  { id: "all", label: "All", icon: "🌍" },
  { id: "gym", label: "Gym", icon: "🏢" },
  { id: "home", label: "Home", icon: "🏠" },
  { id: "anywhere", label: "Anywhere", icon: "📍" },
  { id: "outdoor", label: "Outdoor", icon: "🌳" },
]

export const DIFFICULTIES = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner", color: "#10b981" },
  { id: "intermediate", label: "Intermediate", color: "#f59e0b" },
  { id: "advanced", label: "Advanced", color: "#ef4444" },
]

export const PRESET_WORKOUTS = [
  { name: "Push Day", category: "chest", icon: "🏋️", exercises: ["bench-press","incline-db-press","chest-flyes","overhead-press","lateral-raises","tricep-dips","skull-crushers"], durationMin: 60, environment: "gym" },
  { name: "Pull Day", category: "back", icon: "🚣", exercises: ["deadlift","pull-ups","bent-over-row","lat-pulldown","face-pulls","bicep-curls","hammer-curls"], durationMin: 60, environment: "gym" },
  { name: "Leg Day", category: "legs", icon: "🦵", exercises: ["barbell-squats","leg-press","romanian-deadlift","lunges","calf-raises","wall-sit","bulgarian-split-squat"], durationMin: 55, environment: "gym" },
  { name: "Full Body Home", category: "full-body", icon: "🏠", exercises: ["push-ups","squats","lunges","plank","mountain-climbers","burpees","russian-twists","calf-raises"], durationMin: 40, environment: "home" },
  { name: "Core Crusher", category: "core", icon: "🔥", exercises: ["plank","crunches","russian-twists","mountain-climbers","leg-raises","dead-bug"], durationMin: 25, environment: "anywhere" },
  { name: "HIIT Cardio", category: "cardio", icon: "💥", exercises: ["jumping-jacks","burpees","high-knees","mountain-climbers","box-jumps","jump-rope"], durationMin: 30, environment: "anywhere" },
  { name: "Upper Body Home", category: "chest", icon: "💪", exercises: ["push-ups","diamond-pushups","pike-pushups","tricep-dips","bicep-curls","lateral-raises","plank"], durationMin: 35, environment: "home" },
  { name: "Flexibility Flow", category: "stretching", icon: "🧘", exercises: ["hamstring-stretch","hip-flexor-stretch","childs-pose","cat-cow","pigeon-pose"], durationMin: 20, environment: "anywhere" },
]
