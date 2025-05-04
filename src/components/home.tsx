import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Dumbbell, Utensils } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SummaryCards from "./SummaryCards";
import WorkoutForm from "./WorkoutForm";
import WorkoutTemplateForm from "./WorkoutTemplateForm";
import MealForm from "./MealForm";
import ProgressCharts from "./ProgressCharts";

const Home = () => {
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);

  const handleSaveWorkout = (workout: any) => {
    console.log("Workout saved:", workout);
    // Here you would typically save the workout data to your database
  };

  const handleSaveTemplate = (template: any) => {
    console.log("Template saved:", template);
    // Here you would typically save the template data to your database
  };

  const handleSaveMeal = (meal: any) => {
    console.log("Meal saved:", meal);
    // Here you would typically save the meal data to your database
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setWorkoutDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Workout</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setMealDialogOpen(true)}
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

      <MealForm
        open={mealDialogOpen}
        onOpenChange={setMealDialogOpen}
        onSave={handleSaveMeal}
      />

      <Tabs defaultValue="dashboard" className="w-full">
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

        <TabsContent value="dashboard" className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Today's Summary</h2>
            <SummaryCards />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Your Progress</h2>
            </div>
            <ProgressCharts />
          </section>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-6">
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
            <div className="bg-card rounded-lg p-6 shadow">
              <p className="text-muted-foreground text-center py-8">
                Your workout history will appear here
              </p>
            </div>
          </section>

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
            <div className="bg-card rounded-lg p-6 shadow">
              <p className="text-muted-foreground text-center py-8">
                Your workout templates will appear here
              </p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="meals" className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Meal History</h2>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setMealDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Log Meal</span>
              </Button>
            </div>
            <div className="bg-card rounded-lg p-6 shadow">
              <p className="text-muted-foreground text-center py-8">
                Your meal history will appear here
              </p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
