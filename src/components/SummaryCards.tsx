import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Dumbbell, Utensils, Flame } from "lucide-react";
import gsap from "gsap";

interface SummaryCardsProps {
  workouts?: any[];
  meals?: any[];
}

const SummaryCards = ({ workouts = [], meals = [] }: SummaryCardsProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);

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

  // Animations - with state tracking to prevent duplicate animations
  useEffect(() => {
    // Add a flag to track if animations have run
    if ((window as any)._summaryCardsAnimated) return;
    
    // Function to animate the cards and their contents
    const animateCards = () => {
      // Set the flag that animations have been run
      (window as any)._summaryCardsAnimated = true;
      
      // Create a master timeline for all animations
      const masterTimeline = gsap.timeline();
      
      // Check if cards exist before animating them
      const cards = document.querySelectorAll(".summary-card");
      if (cards.length > 0) {
        masterTimeline.fromTo(
          cards,
          { 
            y: 30,
            opacity: 0,
            scale: 0.95
          },
          { 
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.7)"
          }
        );
      }

      // Animate number counters
      const countElements = document.querySelectorAll('.count-value');
      if (countElements.length > 0) {
        countElements.forEach(element => {
          const value = element.getAttribute("data-value");
          if (value !== null) {
            masterTimeline.fromTo(
              element,
              { textContent: 0 },
              {
                duration: 2,
                textContent: value,
                snap: { textContent: 1 },
                ease: "power2.inOut"
              },
              "-=1.5" // Overlap with previous animation
            );
          }
        });
      }

      // Animate icons
      const icons = document.querySelectorAll(".summary-icon");
      if (icons.length > 0) {
        masterTimeline.fromTo(
          icons,
          { scale: 0, rotate: -30 },
          { 
            scale: 1, 
            rotate: 0,
            duration: 0.8, 
            ease: "elastic.out(1, 0.3)",
            stagger: 0.15
          },
          "-=1.8" // Overlap with previous animation
        );
      }
    };

    // Use a small timeout to ensure DOM is ready
    const timer = setTimeout(animateCards, 150);
    
    // Cleanup function to clear timer if component unmounts before animation
    return () => {
      clearTimeout(timer);
      
      // Reset animation flag on unmount so animations can run again if needed
      // Only reset after a delay to prevent immediate re-animations
      setTimeout(() => {
        (window as any)._summaryCardsAnimated = false;
      }, 300);
    };
  }, [workouts, meals]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" ref={summaryRef}>
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
          <div className="text-2xl font-bold count-value" data-value={todaysWorkouts.length}>
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
          <div className="text-2xl font-bold count-value" data-value={workoutMinutes}>
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
          <div className="text-2xl font-bold count-value" data-value={todaysMeals.length}>
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
          <div className="text-2xl font-bold count-value" data-value={caloriesConsumed}>
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
