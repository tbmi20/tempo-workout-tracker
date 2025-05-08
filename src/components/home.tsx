import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Dumbbell, Utensils, Calendar, Edit, Clock, Copy } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SummaryCards from "./SummaryCards";
import WorkoutForm from "./WorkoutForm";
import WorkoutTemplateForm from "./WorkoutTemplateForm";
import MealForm from "./MealForm";
import MealDiary from "./MealDiary";
import ProgressCharts from "./ProgressCharts";
import WorkoutDetailDialog from "./WorkoutDetailDialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealDiaryProvider } from "@/contexts/MealDiaryContext";
import gsap from "gsap";
import { workoutService, mealService } from "@/lib/supabase";

const Home = () => {
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  
  // Refs for animation targets
  const headerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const workoutCardsRef = useRef<HTMLDivElement>(null);
  const templateCardsRef = useRef<HTMLDivElement>(null);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch workouts
        const workoutData = await workoutService.getWorkouts();
        setWorkouts(workoutData || []);
        
        // Fetch meals
        const mealData = await mealService.getMeals();
        setMeals(mealData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);

  // Animation setup
  useEffect(() => {
    // Animate header with a subtle fade in and slide down
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    // Staggered animation for cards
    gsap.fromTo(
      ".animate-card",
      { 
        y: 50,
        opacity: 0,
        scale: 0.9
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

    // Animate buttons with bounce
    gsap.fromTo(
      ".add-workout-btn, .add-meal-btn",
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5, 
        ease: "back.out(1.7)",
        delay: 0.7
      }
    );
  }, []);

  // Tab change animations
  const handleTabChange = (tab: string) => {
    // Reset animations for the newly selected tab content
    gsap.fromTo(
      `.tab-content-${tab} > *`,
      { 
        y: 20,
        opacity: 0
      },
      { 
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out"
      }
    );
  };

  const handleSaveWorkout = async (workout: any) => {
    try {
      const savedWorkout = await workoutService.addWorkout(workout);
      console.log("Workout saved:", savedWorkout);
      // Update local state
      setWorkouts([savedWorkout, ...workouts]);
      
      // Animate the new workout card appearing
      gsap.fromTo(
        ".workout-card:first-child",
        { 
          y: -20,
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.75)"
        }
      );
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleSaveTemplate = async (template: any) => {
    try {
      // In a real app, you would save this to Supabase
      console.log("Template saved:", template);
      
      // Animate the new template card appearing
      gsap.fromTo(
        ".template-card:first-child",
        { 
          x: -20,
          opacity: 0,
          scale: 0.95
        },
        { 
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.75)"
        }
      );
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleSaveMeal = async (meal: any) => {
    try {
      const savedMeal = await mealService.addMeal(meal);
      // Update local state
      setMeals([savedMeal, ...meals]);
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  const handleViewWorkoutDetails = (workout: any) => {
    setSelectedWorkout(workout);
    setDetailDialogOpen(true);
    
    // Add animation for dialog opening
    setTimeout(() => {
      gsap.fromTo(
        ".workout-detail-content",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }, 100);
  };

  // Sample workout history data
  const workoutHistory = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "May 3, 2025",
      duration: "45 min",
      exercises: [
        { name: "Bench Press", sets: 3, reps: 10, weight: 135 },
        { name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
        { name: "Shoulder Press", sets: 3, reps: 12, weight: 65 },
      ],
    },
    {
      id: 2,
      name: "Leg Day",
      date: "May 1, 2025",
      duration: "55 min",
      exercises: [
        { name: "Squats", sets: 4, reps: 8, weight: 185 },
        { name: "Lunges", sets: 3, reps: 12, weight: 65 },
        { name: "Leg Press", sets: 3, reps: 10, weight: 220 },
      ],
    },
    {
      id: 3,
      name: "Core and Cardio",
      date: "April 29, 2025",
      duration: "35 min",
      exercises: [
        { name: "Plank", sets: 3, reps: 60, weight: 0 },
        { name: "Mountain Climbers", sets: 3, reps: 30, weight: 0 },
        { name: "Jump Rope", sets: 3, reps: 100, weight: 0 },
      ],
    },
  ];

  // Sample workout templates data
  const workoutTemplates = [
    {
      id: 1,
      name: "Upper Body Day",
      exercises: [
        { name: "Bench Press", sets: 4 },
        { name: "Pull-ups", sets: 4 },
        { name: "Shoulder Press", sets: 3 },
        { name: "Bicep Curls", sets: 3 },
        { name: "Tricep Extensions", sets: 3 },
      ],
    },
    {
      id: 2,
      name: "Lower Body Day",
      exercises: [
        { name: "Squats", sets: 5 },
        { name: "Lunges", sets: 3 },
        { name: "Deadlift", sets: 4 },
        { name: "Leg Press", sets: 3 },
      ],
    },
    {
      id: 3,
      name: "Full Body Workout",
      exercises: [
        { name: "Push-ups", sets: 3 },
        { name: "Pull-ups", sets: 3 },
        { name: "Squats", sets: 3 },
        { name: "Plank", sets: 3 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8" ref={headerRef}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 add-workout-btn"
              onClick={() => setWorkoutDialogOpen(true)}
              data-testid="add-workout-button"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Workout</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2 add-meal-btn"
              onClick={() => setMealDialogOpen(true)}
              data-testid="add-meal-button"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Log Meal</span>
            </Button>
          </div>
        </div>
      </header>

      <WorkoutForm 
        open={workoutDialogOpen}
        onOpenChange={setWorkoutDialogOpen}
        onSave={handleSaveWorkout}
      />

      <WorkoutTemplateForm
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSave={handleSaveTemplate}
      />

      <MealDiaryProvider>
        <MealForm
          open={mealDialogOpen}
          onOpenChange={setMealDialogOpen}
          onSave={handleSaveMeal}
          mealToEdit={null}
        />

        <WorkoutDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          workout={selectedWorkout}
        />

        <Tabs 
          defaultValue="dashboard" 
          className="w-full" 
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Meals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 tab-content-dashboard">
            <section ref={summaryRef}>
              <h2 className="text-2xl font-semibold mb-4">Today's Summary</h2>
              <SummaryCards workouts={workouts} meals={meals} />
            </section>

            <section ref={progressRef}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Your Progress</h2>
              </div>
              <ProgressCharts workouts={workouts} meals={meals} />
            </section>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6 tab-content-workouts">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Workout Templates</h2>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setTemplateDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Template</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={templateCardsRef}>
                {workoutTemplates.map((template, index) => (
                  <Card key={template.id} className="overflow-hidden template-card animate-card">
                    <CardHeader className="bg-secondary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{template.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {template.exercises.length} exercises
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 h-[180px] overflow-y-auto">
                      <div className="space-y-2">
                        {template.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <Badge variant="outline">{exercise.sets} sets</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-2 pb-2 flex justify-between">
                      <Button variant="outline" size="sm">
                        <Copy className="h-3 w-3 mr-1" /> Use Template
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Workout History</h2>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setWorkoutDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Workout</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={workoutCardsRef}>
                {workoutHistory.map((workout, index) => (
                  <Card key={workout.id} className="overflow-hidden workout-card animate-card">
                    <CardHeader className="bg-primary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{workout.name}</CardTitle>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {workout.date}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" /> {workout.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 h-[180px] overflow-y-auto">
                      <div className="space-y-2">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps × {exercise.weight > 0 ? `${exercise.weight} lbs` : 'BW'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-2 pb-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewWorkoutDetails(workout)}
                        className="details-btn"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="meals" className="space-y-6 tab-content-meals">
            <MealDiary meals={meals} onDeleteMeal={(id) => {
              mealService.deleteMeal(id);
              setMeals(meals.filter(meal => meal.id !== id));
            }} />
          </TabsContent>
        </Tabs>
      </MealDiaryProvider>
    </div>
  );
};

export default Home;
