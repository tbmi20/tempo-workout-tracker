import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Dumbbell, Utensils, Calendar, Edit, Clock, Copy, LogIn } from "lucide-react";
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
import { workoutService, mealService, templateService } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
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

  // Animation setup
  useEffect(() => {
    // Animate header with a subtle fade in and slide down, but ensure it stays visible
    gsap.fromTo(headerRef.current, 
      {
        y: -50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        clearProps: "all" // This ensures props are cleared after animation so header stays visible
      }
    );
    
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
      let savedWorkout;
      
      // Check if we're editing an existing workout
      if (editingWorkout) {
        savedWorkout = await workoutService.updateWorkout(editingWorkout.id, {
          ...workout,
          completed_at: new Date(workout.date).toISOString()
        });
        
        // Update the workout in the existing array
        setWorkouts(workouts.map(w => w.id === editingWorkout.id ? savedWorkout : w));
        setEditingWorkout(null); // Clear editing state
        
        toast({
          title: "Workout updated",
          description: "Your workout has been updated successfully.",
        });
      } else {
        // Create a new workout
        savedWorkout = await workoutService.addWorkout({
          name: workout.exercises[0]?.name || "Workout",
          exercises: workout.exercises,
          completed_at: new Date(workout.date).toISOString()
        });
        
        // Add new workout to the array
        setWorkouts([savedWorkout, ...workouts]);
        
        toast({
          title: "Workout added",
          description: "Your workout has been saved successfully.",
        });
      }
      
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
      toast({
        title: "Error saving workout",
        description: "Something went wrong while saving your workout.",
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
        setEditingTemplate(null); // Clear editing state
        
        toast({
          title: "Template updated",
          description: "Your workout template has been updated successfully.",
        });
      } else {
        // Create a new template
        savedTemplate = await templateService.addTemplate(template);
        
        // Add new template to the array
        setTemplates([savedTemplate, ...templates]);
        
        toast({
          title: "Template created",
          description: "Your workout template has been saved successfully.",
        });
      }
      
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
      toast({
        title: "Error saving template",
        description: "Something went wrong while saving your workout template.",
        variant: "destructive",
      });
    }
  };

  const handleSaveMeal = async (meal: any) => {
    try {
      const savedMeal = await mealService.addMeal(meal);
      // Update local state
      setMeals([savedMeal, ...meals]);
      
      toast({
        title: "Meal logged",
        description: "Your meal has been logged successfully.",
      });
    } catch (error) {
      console.error("Error saving meal:", error);
      toast({
        title: "Error logging meal",
        description: "Something went wrong while logging your meal.",
        variant: "destructive",
      });
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

  const handleEditWorkout = (workout: any) => {
    setEditingWorkout(workout);
    setWorkoutDialogOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleCopyTemplate = async (template: any) => {
    try {
      // Create a copy with a new name
      const newTemplate = {
        name: `${template.name} (Copy)`,
        exercises: template.template_exercises || []
      };
      
      const savedTemplate = await templateService.addTemplate(newTemplate);
      setTemplates([savedTemplate, ...templates]);
      
      toast({
        title: "Template copied",
        description: "Your workout template has been duplicated.",
      });
    } catch (error) {
      console.error("Error copying template:", error);
      toast({
        title: "Error copying template",
        description: "Something went wrong while copying your template.",
        variant: "destructive",
      });
    }
  };

  const handleUseTemplate = async (template: any) => {
    try {
      const newWorkout = await templateService.useTemplate(template.id);
      setWorkouts([newWorkout, ...workouts]);
      
      toast({
        title: "Workout started",
        description: "A new workout has been created from your template.",
      });
    } catch (error) {
      console.error("Error using template:", error);
      toast({
        title: "Error starting workout",
        description: "Something went wrong while creating a workout from your template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter(workout => workout.id !== id));
      
      toast({
        title: "Workout deleted",
        description: "Your workout has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast({
        title: "Error deleting workout",
        description: "Something went wrong while deleting your workout.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
      
      toast({
        title: "Template deleted",
        description: "Your workout template has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: "Something went wrong while deleting your template.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 border-b pb-4 pt-2 bg-background sticky top-0" ref={headerRef}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Tempo</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="default" 
              className="flex items-center gap-2 login-btn shadow-sm"
              data-testid="login-register-button"
            >
              <LogIn className="h-4 w-4" />
              <span>Login / Register</span>
            </Button>
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
                  onClick={() => {
                    setEditingTemplate(null); // Ensure we're not in edit mode
                    setTemplateDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Template</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={templateCardsRef}>
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden template-card animate-card">
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
                            onClick={() => handleCopyTemplate(template)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={workoutCardsRef}>
                {workouts.map((workout) => (
                  <Card key={workout.id} className="overflow-hidden workout-card animate-card">
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
                        onClick={() => handleViewWorkoutDetails(workout)}
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
