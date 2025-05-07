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