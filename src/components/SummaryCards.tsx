import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Dumbbell, Utensils, Flame } from "lucide-react";

interface SummaryCardsProps {
  workouts?: any[];
  meals?: any[];
}

const SummaryCards = ({ workouts = [], meals = [] }: SummaryCardsProps) => {
  // Calculate statistics
  const today = new Date().setHours(0, 0, 0, 0);
  
  // Calculate today's workouts
  const todaysWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.completed_at).setHours(0, 0, 0, 0);
    return workoutDate === today;
  });
  
  // Calculate today's workout minutes
  const workoutMinutes = todaysWorkouts.reduce((total, workout) => {
    return total + (workout.duration || 0);
  }, 0);
  
  // Calculate today's meals
  const todaysMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.consumed_at).setHours(0, 0, 0, 0);
    return mealDate === today;
  });
  
  // Calculate today's calories
  const caloriesConsumed = todaysMeals.reduce((total, meal) => {
    return total + (meal.calories || 0);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <CardDescription>Today's sessions</CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full summary-icon">
            <Dumbbell className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todaysWorkouts.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {todaysWorkouts.length === 0 
              ? "No workouts today" 
              : todaysWorkouts.length === 1 
                ? "1 workout completed" 
                : `${todaysWorkouts.length} workouts completed`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
            <CardDescription>Total workout time</CardDescription>
          </div>
          <div className="bg-secondary/10 p-2 rounded-full summary-icon">
            <Activity className="h-4 w-4 text-secondary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {workoutMinutes}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {workoutMinutes === 0 
              ? "No active minutes today" 
              : workoutMinutes === 1 
                ? "1 minute of activity" 
                : `${workoutMinutes} minutes of activity`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Meals Logged</CardTitle>
            <CardDescription>Today's nutrition</CardDescription>
          </div>
          <div className="bg-green-500/10 p-2 rounded-full summary-icon">
            <Utensils className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todaysMeals.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {todaysMeals.length === 0 
              ? "No meals logged today" 
              : todaysMeals.length === 1 
                ? "1 meal logged" 
                : `${todaysMeals.length} meals logged`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <CardDescription>Today's intake</CardDescription>
          </div>
          <div className="bg-orange-500/10 p-2 rounded-full summary-icon">
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {caloriesConsumed}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {caloriesConsumed === 0 
              ? "No calories tracked today" 
              : `${caloriesConsumed} calories consumed`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
