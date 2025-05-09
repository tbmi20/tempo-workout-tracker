import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Dumbbell, Utensils, Calendar, Edit, Clock, Copy, LogIn, LogOut, User } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workoutService, mealService, templateService } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  // Use the auth context
  const { user, signOut } = useAuth();
  
  // Rest of the component state
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  
  // State for editing
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // The AuthContext will handle the redirection to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch workouts
        const workoutData = await workoutService.getWorkouts();
        setWorkouts(workoutData || []);
        
        // Fetch workout templates
        const templateData = await templateService.getTemplates();
        setTemplates(templateData || []);
        
        // Fetch meals
        const mealData = await mealService.getMeals();
        setMeals(mealData || []);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, []);

  const handleSaveWorkout = async (workout: any) => {
    try {
      let savedWorkout;
      
      // Check if we're editing an existing workout
      if (editingWorkout) {
        savedWorkout = await workoutService.updateWorkout(editingWorkout.id, {
          ...workout,
          completed_at: new Date(workout.date).toISOString()
        });
        
        // Update the workout in the existing array
        setWorkouts(workouts.map(w => w.id === editingWorkout.id ? savedWorkout : w));
        
        toast({
          title: "Workout updated",
          description: `Your workout "${workout.name}" has been updated.`,
        });
      } else {
        // Add new workout
        savedWorkout = await workoutService.addWorkout({
          ...workout,
          completed_at: new Date(workout.date).toISOString()
        });
        
        // Add the new workout to the array
        setWorkouts([savedWorkout, ...workouts]);
        
        toast({
          title: "Workout added",
          description: `Your workout "${workout.name}" has been added.`,
        });
      }
      
      // Close the dialog and reset editing state
      setWorkoutDialogOpen(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error saving workout",
        description: "Could not save your workout. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTemplate = async (template: any) => {
    try {
      let savedTemplate;
      
      // Check if we're editing an existing template
      if (editingTemplate) {
        savedTemplate = await templateService.updateTemplate(editingTemplate.id, template);
        
        // Update the template in the existing array
        setTemplates(templates.map(t => t.id === editingTemplate.id ? savedTemplate : t));
        
        toast({
          title: "Template updated",
          description: `Your template "${template.name}" has been updated.`,
        });
      } else {
        // Add new template
        savedTemplate = await templateService.addTemplate(template);
        
        // Add the new template to the array
        setTemplates([savedTemplate, ...templates]);
        
        toast({
          title: "Template added",
          description: `Your template "${template.name}" has been added.`,
        });
      }
      
      // Close the dialog and reset editing state
      setTemplateDialogOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: "Could not save your template. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSaveMeal = async (meal: any) => {
    try {
      // Add new meal
      const savedMeal = await mealService.addMeal({
        ...meal,
        consumed_at: new Date(meal.date).toISOString()
      });
      
      // Add the new meal to the array
      setMeals([savedMeal, ...meals]);
      
      // Close the dialog
      setMealDialogOpen(false);
      
      toast({
        title: "Meal added",
        description: `Your meal "${meal.name}" has been added.`,
      });
    } catch (error) {
      console.error("Error saving meal:", error);
      toast({
        title: "Error saving meal",
        description: "Could not save your meal. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await workoutService.deleteWorkout(id);
      
      // Remove the workout from the array
      setWorkouts(workouts.filter(workout => workout.id !== id));
      
      // Close the detail dialog if it's open
      if (detailDialogOpen && selectedWorkout?.id === id) {
        setDetailDialogOpen(false);
      }
      
      toast({
        title: "Workout deleted",
        description: "Your workout has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast({
        title: "Error deleting workout",
        description: "Could not delete your workout. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templateService.deleteTemplate(id);
      
      // Remove the template from the array
      setTemplates(templates.filter(template => template.id !== id));
      
      toast({
        title: "Template deleted",
        description: "Your workout template has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: "Could not delete your template. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditWorkout = (workout: any) => {
    setEditingWorkout(workout);
    setWorkoutDialogOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleViewWorkoutDetail = (workout: any) => {
    setSelectedWorkout(workout);
    setDetailDialogOpen(true);
  };

  const handleUseTemplate = (template: any) => {
    // Convert template to workout format
    const workout = {
      name: template.name,
      duration: 60, // Default duration
      notes: `Created from template: ${template.name}`,
      date: new Date().toISOString().split('T')[0],
      exercises: template.template_exercises?.map((exercise: any) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: 10, // Default reps
        weight: null
      })) || []
    };
    
    // Open the workout form with pre-populated data
    setEditingWorkout(workout);
    setWorkoutDialogOpen(true);
  };

  const handleDuplicateTemplate = (template: any) => {
    // Create a copy of the template
    const newTemplate = {
      name: `Copy of ${template.name}`,
      exercises: template.template_exercises?.map((exercise: any) => ({
        name: exercise.name,
        sets: exercise.sets
      })) || []
    };
    
    // Open the template form with pre-populated data
    setEditingTemplate(newTemplate);
    setTemplateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 border-b pb-4 pt-2 bg-background sticky top-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Tempo</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2 shadow-sm"
                  data-testid="user-menu-button"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.email?.split('@')[0] || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="flex items-center gap-2 add-workout-btn shadow-sm"
                onClick={() => {
                  setEditingWorkout(null); // Ensure we're not in edit mode
                  setWorkoutDialogOpen(true);
                }}
                data-testid="add-workout-button"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Workout</span>
              </Button>

              <Button 
                variant="secondary" 
                className="flex items-center gap-2 add-meal-btn shadow-sm"
                onClick={() => setMealDialogOpen(true)}
                data-testid="add-meal-button"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Log Meal</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <WorkoutForm 
        open={workoutDialogOpen}
        onOpenChange={setWorkoutDialogOpen}
        onSave={handleSaveWorkout}
        initialWorkout={editingWorkout}
      />

      <WorkoutTemplateForm
        open={templateDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingTemplate(null);
          setTemplateDialogOpen(open);
        }}
        onSave={handleSaveTemplate}
        initialTemplate={editingTemplate}
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

          <TabsContent value="dashboard" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Today's Summary</h2>
              <SummaryCards workouts={workouts} meals={meals} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Your Progress</h2>
              </div>
              <ProgressCharts workouts={workouts} meals={meals} />
            </section>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Workout Templates</h2>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => {
                    setEditingTemplate(null); // Ensure we're not in edit mode
                    setTemplateDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Template</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden template-card">
                    <CardHeader className="bg-secondary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{template.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {template.template_exercises?.length || 0} exercises
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 h-[180px] overflow-y-auto">
                      <div className="space-y-2">
                        {template.template_exercises?.map((exercise: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <Badge variant="outline">{exercise.sets} sets</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-2 pb-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Use Template
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {templates.length === 0 && (
                  <div className="col-span-full text-center py-8 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No workout templates yet. Create your first template!</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Workout History</h2>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => {
                    setEditingWorkout(null); // Ensure we're not in edit mode
                    setWorkoutDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Workout</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map((workout) => (
                  <Card key={workout.id} className="overflow-hidden workout-card">
                    <CardHeader className="bg-primary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{workout.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditWorkout(workout)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {new Date(workout.completed_at).toLocaleDateString()}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" /> {workout.duration || "45 min"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 h-[180px] overflow-y-auto">
                      <div className="space-y-2">
                        {workout.exercises?.map((exercise: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps × {exercise.weight > 0 ? `${exercise.weight} lbs` : 'BW'}
                            </span>
                          </div>
                        )) || (
                          <p className="text-muted-foreground">No exercises recorded for this workout.</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-2 pb-2 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewWorkoutDetail(workout)}
                        className="details-btn"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {workouts.length === 0 && (
                  <div className="col-span-full text-center py-8 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No workouts recorded yet. Add your first workout!</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="meals" className="space-y-6">
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
