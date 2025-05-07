import React, { createContext, useState, useContext, ReactNode } from "react";

// Interfaces for meal diary entries
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  name: string;
  date: string;
  time: string;
  mealType: string;
  calories: number;
  items: FoodItem[];
  notes?: string;
}

interface MealsByDate {
  [date: string]: MealEntry[];
}

interface MealDiaryContextProps {
  meals: MealEntry[];
  mealsByDate: MealsByDate;
  addMeal: (meal: Omit<MealEntry, "id">) => void;
  updateMeal: (id: string, meal: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  getMealById: (id: string) => MealEntry | undefined;
  getMealsByDate: (date: string) => MealEntry[];
  getDateRange: (startDate: string, endDate: string) => MealEntry[];
  getTotalCaloriesByDate: (date: string) => number;
  getTotalProteinByDate: (date: string) => number;
  getTotalCarbsByDate: (date: string) => number;
  getTotalFatByDate: (date: string) => number;
}

// Sample data
const initialMeals: MealEntry[] = [
  {
    id: "1",
    name: "Breakfast",
    date: "2025-05-04",
    time: "8:30 AM",
    mealType: "breakfast",
    calories: 450,
    items: [
      { id: "1-1", name: "Oatmeal with berries", calories: 280, protein: 8, carbs: 45, fat: 6 },
      { id: "1-2", name: "Greek yogurt", calories: 120, protein: 15, carbs: 7, fat: 0 },
      { id: "1-3", name: "Black coffee", calories: 5, protein: 0, carbs: 0, fat: 0 },
      { id: "1-4", name: "Almond butter", calories: 45, protein: 2, carbs: 2, fat: 4 },
    ],
    notes: "Felt energized after this breakfast!"
  },
  {
    id: "2",
    name: "Lunch",
    date: "2025-05-03",
    time: "12:45 PM",
    mealType: "lunch",
    calories: 620,
    items: [
      { id: "2-1", name: "Grilled chicken salad", calories: 320, protein: 35, carbs: 15, fat: 12 },
      { id: "2-2", name: "Whole grain bread", calories: 120, protein: 5, carbs: 20, fat: 2 },
      { id: "2-3", name: "Olive oil dressing", calories: 90, protein: 0, carbs: 0, fat: 10 },
      { id: "2-4", name: "Apple", calories: 90, protein: 0, carbs: 22, fat: 0 },
    ]
  },
  {
    id: "3",
    name: "Dinner",
    date: "2025-05-03",
    time: "7:00 PM",
    mealType: "dinner",
    calories: 580,
    items: [
      { id: "3-1", name: "Salmon fillet", calories: 280, protein: 32, carbs: 0, fat: 16 },
      { id: "3-2", name: "Brown rice", calories: 150, protein: 3, carbs: 32, fat: 1 },
      { id: "3-3", name: "Steamed broccoli", calories: 50, protein: 4, carbs: 8, fat: 0 },
      { id: "3-4", name: "Avocado", calories: 100, protein: 1, carbs: 5, fat: 9 },
    ],
    notes: "Really satisfying dinner after workout"
  },
  {
    id: "4",
    name: "Post-workout Snack",
    date: "2025-05-03",
    time: "4:15 PM",
    mealType: "snack",
    calories: 320,
    items: [
      { id: "4-1", name: "Protein shake", calories: 180, protein: 25, carbs: 10, fat: 3 },
      { id: "4-2", name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { id: "4-3", name: "Handful of almonds", calories: 35, protein: 2, carbs: 1, fat: 3 },
    ]
  },
  {
    id: "5",
    name: "Lunch",
    date: "2025-05-04",
    time: "1:15 PM",
    mealType: "lunch",
    calories: 550,
    items: [
      { id: "5-1", name: "Turkey sandwich", calories: 320, protein: 28, carbs: 30, fat: 10 },
      { id: "5-2", name: "Mixed greens salad", calories: 70, protein: 2, carbs: 8, fat: 3 },
      { id: "5-3", name: "Balsamic vinaigrette", calories: 60, protein: 0, carbs: 3, fat: 6 },
      { id: "5-4", name: "Sparkling water", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]
  },
  {
    id: "6",
    name: "Afternoon Snack",
    date: "2025-05-04",
    time: "3:45 PM",
    mealType: "snack",
    calories: 210,
    items: [
      { id: "6-1", name: "Greek yogurt", calories: 120, protein: 15, carbs: 7, fat: 0 },
      { id: "6-2", name: "Honey", calories: 40, protein: 0, carbs: 10, fat: 0 },
      { id: "6-3", name: "Mixed berries", calories: 50, protein: 1, carbs: 12, fat: 0 },
    ],
    notes: "Perfect pre-workout energy boost"
  },
  {
    id: "7",
    name: "Dinner",
    date: "2025-05-04",
    time: "7:30 PM",
    mealType: "dinner",
    calories: 720,
    items: [
      { id: "7-1", name: "Grilled steak", calories: 350, protein: 40, carbs: 0, fat: 18 },
      { id: "7-2", name: "Sweet potato", calories: 180, protein: 2, carbs: 40, fat: 0 },
      { id: "7-3", name: "Asparagus", calories: 40, protein: 4, carbs: 6, fat: 0 },
      { id: "7-4", name: "Olive oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
      { id: "7-5", name: "Glass of red wine", calories: 120, protein: 0, carbs: 4, fat: 0 },
    ]
  },
  {
    id: "8",
    name: "Breakfast",
    date: "2025-05-05",
    time: "7:45 AM",
    mealType: "breakfast",
    calories: 520,
    items: [
      { id: "8-1", name: "Scrambled eggs", calories: 210, protein: 18, carbs: 2, fat: 14 },
      { id: "8-2", name: "Whole grain toast", calories: 120, protein: 5, carbs: 22, fat: 2 },
      { id: "8-3", name: "Avocado spread", calories: 100, protein: 1, carbs: 5, fat: 9 },
      { id: "8-4", name: "Orange juice", calories: 90, protein: 1, carbs: 21, fat: 0 },
    ],
    notes: "High protein breakfast before morning meeting"
  },
  {
    id: "9",
    name: "Morning Snack",
    date: "2025-05-05",
    time: "10:30 AM",
    mealType: "snack",
    calories: 180,
    items: [
      { id: "9-1", name: "Apple", calories: 90, protein: 0, carbs: 22, fat: 0 },
      { id: "9-2", name: "Peanut butter", calories: 90, protein: 4, carbs: 3, fat: 7 },
    ]
  },
  {
    id: "10",
    name: "Lunch",
    date: "2025-05-05",
    time: "12:30 PM",
    mealType: "lunch",
    calories: 650,
    items: [
      { id: "10-1", name: "Quinoa bowl", calories: 280, protein: 10, carbs: 45, fat: 6 },
      { id: "10-2", name: "Grilled chicken", calories: 200, protein: 28, carbs: 0, fat: 8 },
      { id: "10-3", name: "Roasted vegetables", calories: 100, protein: 3, carbs: 18, fat: 2 },
      { id: "10-4", name: "Tahini dressing", calories: 70, protein: 2, carbs: 1, fat: 6 },
    ],
    notes: "Meal prepped this on Sunday - so convenient!"
  },
  {
    id: "11",
    name: "Dinner",
    date: "2025-05-05",
    time: "6:45 PM",
    mealType: "dinner",
    calories: 680,
    items: [
      { id: "11-1", name: "Shrimp pasta", calories: 420, protein: 25, carbs: 55, fat: 10 },
      { id: "11-2", name: "Caesar salad", calories: 160, protein: 6, carbs: 8, fat: 12 },
      { id: "11-3", name: "Garlic bread", calories: 100, protein: 3, carbs: 15, fat: 3 },
    ]
  },
  {
    id: "12",
    name: "Breakfast",
    date: "2025-05-06",
    time: "8:00 AM",
    mealType: "breakfast",
    calories: 480,
    items: [
      { id: "12-1", name: "Protein pancakes", calories: 320, protein: 20, carbs: 40, fat: 8 },
      { id: "12-2", name: "Maple syrup", calories: 80, protein: 0, carbs: 20, fat: 0 },
      { id: "12-3", name: "Fresh strawberries", calories: 45, protein: 1, carbs: 10, fat: 0 },
      { id: "12-4", name: "Coffee with almond milk", calories: 35, protein: 1, carbs: 2, fat: 2.5 },
    ]
  },
  {
    id: "13",
    name: "Lunch",
    date: "2025-05-06",
    time: "1:00 PM",
    mealType: "lunch",
    calories: 590,
    items: [
      { id: "13-1", name: "Tuna wrap", calories: 350, protein: 30, carbs: 28, fat: 12 },
      { id: "13-2", name: "Vegetable soup", calories: 120, protein: 5, carbs: 18, fat: 2 },
      { id: "13-3", name: "Crackers", calories: 80, protein: 2, carbs: 15, fat: 1 },
      { id: "13-4", name: "Apple", calories: 90, protein: 0, carbs: 22, fat: 0 },
    ]
  },
  {
    id: "14",
    name: "Afternoon Snack",
    date: "2025-05-06",
    time: "4:00 PM",
    mealType: "snack",
    calories: 250,
    items: [
      { id: "14-1", name: "Protein bar", calories: 180, protein: 15, carbs: 20, fat: 6 },
      { id: "14-2", name: "Green tea", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { id: "14-3", name: "Tangerine", calories: 70, protein: 1, carbs: 18, fat: 0 },
    ],
    notes: "Quick snack before gym session"
  },
  {
    id: "15",
    name: "Post-Workout Dinner",
    date: "2025-05-06",
    time: "7:45 PM",
    mealType: "dinner",
    calories: 780,
    items: [
      { id: "15-1", name: "Baked chicken breast", calories: 250, protein: 42, carbs: 0, fat: 6 },
      { id: "15-2", name: "Quinoa", calories: 170, protein: 6, carbs: 30, fat: 3 },
      { id: "15-3", name: "Roasted Brussels sprouts", calories: 120, protein: 4, carbs: 12, fat: 7 },
      { id: "15-4", name: "Sweet potato", calories: 180, protein: 2, carbs: 40, fat: 0 },
      { id: "15-5", name: "Olive oil", calories: 60, protein: 0, carbs: 0, fat: 7 },
    ],
    notes: "Hit my protein goal with this meal"
  },
  {
    id: "16",
    name: "Breakfast",
    date: "2025-05-07",
    time: "8:15 AM",
    mealType: "breakfast",
    calories: 420,
    items: [
      { id: "16-1", name: "Avocado toast", calories: 280, protein: 8, carbs: 30, fat: 15 },
      { id: "16-2", name: "Fried egg", calories: 90, protein: 7, carbs: 0, fat: 7 },
      { id: "16-3", name: "Fruit smoothie", calories: 150, protein: 2, carbs: 35, fat: 0 },
    ]
  }
];

// Create the context
export const MealDiaryContext = createContext<MealDiaryContextProps | undefined>(undefined);

// Provider component
interface MealDiaryProviderProps {
  children: ReactNode;
}

export const MealDiaryProvider = ({ children }: MealDiaryProviderProps) => {
  const [meals, setMeals] = useState<MealEntry[]>(initialMeals);

  // Group meals by date for easier access
  const mealsByDate = meals.reduce((acc: MealsByDate, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {});

  // Add a new meal
  const addMeal = (meal: Omit<MealEntry, "id">) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(), // Simple ID generation
    };
    setMeals(prevMeals => [...prevMeals, newMeal]);
  };

  // Update an existing meal
  const updateMeal = (id: string, updatedMeal: Partial<MealEntry>) => {
    setMeals(prevMeals => 
      prevMeals.map(meal => 
        meal.id === id ? { ...meal, ...updatedMeal } : meal
      )
    );
  };

  // Delete a meal
  const deleteMeal = (id: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
  };

  // Get a meal by ID
  const getMealById = (id: string) => {
    return meals.find(meal => meal.id === id);
  };

  // Get all meals for a specific date
  const getMealsByDate = (date: string) => {
    return mealsByDate[date] || [];
  };

  // Get meals within a date range
  const getDateRange = (startDate: string, endDate: string) => {
    return meals.filter(meal => meal.date >= startDate && meal.date <= endDate);
  };

  // Calculate total calories for a specific date
  const getTotalCaloriesByDate = (date: string) => {
    const mealsOnDate = getMealsByDate(date);
    return mealsOnDate.reduce((total, meal) => total + meal.calories, 0);
  };

  // Calculate total protein for a specific date
  const getTotalProteinByDate = (date: string) => {
    const mealsOnDate = getMealsByDate(date);
    return mealsOnDate.reduce((total, meal) => total + meal.items.reduce((sum, item) => sum + item.protein, 0), 0);
  };

  // Calculate total carbs for a specific date
  const getTotalCarbsByDate = (date: string) => {
    const mealsOnDate = getMealsByDate(date);
    return mealsOnDate.reduce((total, meal) => total + meal.items.reduce((sum, item) => sum + item.carbs, 0), 0);
  };

  // Calculate total fat for a specific date
  const getTotalFatByDate = (date: string) => {
    const mealsOnDate = getMealsByDate(date);
    return mealsOnDate.reduce((total, meal) => total + meal.items.reduce((sum, item) => sum + item.fat, 0), 0);
  };

  return (
    <MealDiaryContext.Provider
      value={{
        meals,
        mealsByDate,
        addMeal,
        updateMeal,
        deleteMeal,
        getMealById,
        getMealsByDate,
        getDateRange,
        getTotalCaloriesByDate,
        getTotalProteinByDate,
        getTotalCarbsByDate,
        getTotalFatByDate,
      }}
    >
      {children}
    </MealDiaryContext.Provider>
  );
};

// Custom hook for using the meal diary context
export const useMealDiary = () => {
  const context = useContext(MealDiaryContext);
  if (context === undefined) {
    throw new Error("useMealDiary must be used within a MealDiaryProvider");
  }
  return context;
};