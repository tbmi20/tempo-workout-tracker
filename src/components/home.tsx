import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Dumbbell, Utensils } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SummaryCards from "./SummaryCards";
import WorkoutForm from "./WorkoutForm";
import MealForm from "./MealForm";
import ProgressCharts from "./ProgressCharts";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Workout</span>
                </Button>
              </DialogTrigger>
              <WorkoutForm />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Log Meal</span>
                </Button>
              </DialogTrigger>
              <MealForm />
            </Dialog>
          </div>
        </div>
      </header>

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Workout</span>
                  </Button>
                </DialogTrigger>
                <WorkoutForm />
              </Dialog>
            </div>
            <div className="bg-card rounded-lg p-6 shadow">
              <p className="text-muted-foreground text-center py-8">
                Your workout history will appear here
              </p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="meals" className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Meal History</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Log Meal</span>
                  </Button>
                </DialogTrigger>
                <MealForm />
              </Dialog>
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
