import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Dumbbell,
  Utensils,
  Clock,
  Calendar,
} from "lucide-react";

interface WorkoutSummary {
  totalWorkouts: number;
  totalExercises: number;
  lastWorkout: string;
  recentExercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
  trend: "up" | "down" | "stable";
}

interface MealSummary {
  totalMeals: number;
  totalCalories: number;
  lastMeal: string;
  recentMeals: Array<{
    name: string;
    type: string;
    calories: number;
  }>;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface SummaryCardsProps {
  workoutSummary?: WorkoutSummary;
  mealSummary?: MealSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  workoutSummary = {
    totalWorkouts: 12,
    totalExercises: 36,
    lastWorkout: "2 hours ago",
    recentExercises: [
      { name: "Bench Press", sets: 3, reps: 10, weight: 135 },
      { name: "Squats", sets: 4, reps: 8, weight: 185 },
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
    ],
    trend: "up",
  },
  mealSummary = {
    totalMeals: 3,
    totalCalories: 1850,
    lastMeal: "45 minutes ago",
    recentMeals: [
      { name: "Grilled Chicken Salad", type: "Lunch", calories: 450 },
      { name: "Protein Shake", type: "Snack", calories: 220 },
      { name: "Oatmeal with Berries", type: "Breakfast", calories: 320 },
    ],
    macros: {
      protein: 120,
      carbs: 180,
      fat: 45,
    },
  },
}) => {
  return (
    <div className="w-full space-y-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Summary Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <CardTitle>Workout Summary</CardTitle>
              </div>
              <Badge
                variant={
                  workoutSummary.trend === "up" ? "default" : "destructive"
                }
                className="flex items-center gap-1"
              >
                {workoutSummary.trend === "up" ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {workoutSummary.trend === "up" ? "Improving" : "Decreasing"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Last workout: {workoutSummary.lastWorkout}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Total Workouts
                </span>
                <span className="text-2xl font-bold">
                  {workoutSummary.totalWorkouts}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Total Exercises
                </span>
                <span className="text-2xl font-bold">
                  {workoutSummary.totalExercises}
                </span>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Exercises</h4>
              <div className="space-y-2">
                {workoutSummary.recentExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight > 0 ? ` @ ${exercise.weight}lbs` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>This Week</span>
            </div>
          </CardFooter>
        </Card>

        {/* Meal Summary Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                <CardTitle>Meal Summary</CardTitle>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                {mealSummary.totalCalories} calories today
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Today's Nutrition</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                <span className="text-xs text-muted-foreground">Protein</span>
                <span className="text-lg font-bold">
                  {mealSummary.macros.protein}g
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                <span className="text-xs text-muted-foreground">Carbs</span>
                <span className="text-lg font-bold">
                  {mealSummary.macros.carbs}g
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                <span className="text-xs text-muted-foreground">Fat</span>
                <span className="text-lg font-bold">
                  {mealSummary.macros.fat}g
                </span>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Meals</h4>
              <div className="space-y-2">
                {mealSummary.recentMeals.map((meal, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-medium">{meal.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {meal.type}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {meal.calories} cal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Last meal: {mealSummary.lastMeal}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SummaryCards;
