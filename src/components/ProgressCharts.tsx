import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import gsap from "gsap";

interface ProgressChartsProps {
  workouts?: any[];
  meals?: any[];
}

const ProgressCharts = ({ workouts = [], meals = [] }: ProgressChartsProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Process workout data for charts
  const processWorkoutData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString(undefined, { weekday: 'short' }),
        timestamp: date.getTime(),
      };
    });

    const workoutsByDay = last7Days.map(day => {
      const dayWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.completed_at).toISOString().split('T')[0];
        return workoutDate === day.date;
      });

      return {
        name: day.displayDate,
        minutes: dayWorkouts.reduce((total, workout) => total + (workout.duration || 0), 0),
        sessions: dayWorkouts.length
      };
    });

    return workoutsByDay;
  };

  // Process meal data for charts
  const processMealData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString(undefined, { weekday: 'short' }),
        timestamp: date.getTime(),
      };
    });

    const mealsByDay = last7Days.map(day => {
      const dayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.consumed_at).toISOString().split('T')[0];
        return mealDate === day.date;
      });

      return {
        name: day.displayDate,
        calories: dayMeals.reduce((total, meal) => total + (meal.calories || 0), 0),
        protein: dayMeals.reduce((total, meal) => total + (meal.protein || 0), 0),
        carbs: dayMeals.reduce((total, meal) => total + (meal.carbs || 0), 0),
        fat: dayMeals.reduce((total, meal) => total + (meal.fat || 0), 0)
      };
    });

    return mealsByDay;
  };

  // GSAP animations with state tracking to prevent duplicate animations
  useEffect(() => {
    // Check if animations have already run
    if ((window as any)._progressChartsAnimated) return;
    
    // Only animate if the chart container exists
    if (!chartRef.current) return;
    
    // Mark that we're animating this component
    (window as any)._progressChartsAnimated = true;

    // Animation timeline for better control and sequencing
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('Progress charts animation complete');
      }
    });
    
    // Animate the chart container
    tl.fromTo(
      chartRef.current,
      { 
        opacity: 0,
        y: 30
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all" // Clear props after animation to prevent conflicts
      }
    );

    // Wait a bit for charts to render properly
    setTimeout(() => {
      // Check if chart elements exist before animating them
      const chartSurfaces = document.querySelectorAll(".recharts-surface");
      if (chartSurfaces.length > 0) {
        tl.fromTo(
          chartSurfaces,
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1, 0.8)",
            stagger: 0.2,
            clearProps: "all" // Clear props after animation to prevent conflicts
          },
          "-=0.4" // Overlap with previous animation
        );
      }

      // Check if chart layers exist before animating them
      const chartLayers = document.querySelectorAll(".recharts-layer");
      if (chartLayers.length > 0) {
        tl.fromTo(
          chartLayers,
          { opacity: 0 },
          { 
            opacity: 1,
            duration: 1.5,
            stagger: 0.05,
            ease: "power2.inOut",
            clearProps: "all" // Clear props after animation to prevent conflicts
          },
          "-=0.7" // Overlap with previous animation
        );
      }
    }, 100);
    
    // Cleanup function
    return () => {
      // Set a delay before allowing animations to run again
      setTimeout(() => {
        (window as any)._progressChartsAnimated = false;
      }, 300);
    };
  }, [workouts, meals]);

  const workoutData = processWorkoutData();
  const mealData = processMealData();

  // Generate sample data for strength progress if not enough real data
  const strengthData = workouts.length < 3 ? [
    { name: "Week 1", squat: 135, deadlift: 185, bench: 95 },
    { name: "Week 2", squat: 145, deadlift: 195, bench: 100 },
    { name: "Week 3", squat: 155, deadlift: 205, bench: 105 },
    { name: "Week 4", squat: 165, deadlift: 215, bench: 115 }
  ] : []; // In a real app, you'd process real strength data here

  const handleTabChange = (tab: string) => {
    // Create a unique key for this specific tab animation
    const tabAnimKey = `_tabAnimated_${tab}`;
    
    // Only run animation if we haven't animated this tab recently
    if ((window as any)[tabAnimKey]) return;
    
    // Mark this tab as recently animated
    (window as any)[tabAnimKey] = true;
    
    // Wait a small amount of time for the tab content to be visible in the DOM
    setTimeout(() => {
      // Check if the elements exist before animating
      const surfaces = document.querySelectorAll(`.${tab}-chart .recharts-surface`);
      if (surfaces.length > 0) {
        gsap.fromTo(
          surfaces,
          { opacity: 0.5, scale: 0.95 },
          { 
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            clearProps: "all" // Clear props after animation
          }
        );
      }
      
      // Reset the animation flag after a delay
      setTimeout(() => {
        (window as any)[tabAnimKey] = false;
      }, 300);
    }, 100); // Small delay to ensure DOM elements are ready
  };

  return (
    <Card className="relative overflow-hidden" ref={chartRef}>
      <CardHeader>
        <CardTitle>Fitness Progress</CardTitle>
        <CardDescription>
          Track your fitness journey over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="activity-chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={workoutData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="minutes"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    activeDot={{ r: 8 }}
                    name="Minutes"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="sessions"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                    activeDot={{ r: 6 }}
                    name="Sessions"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition" className="nutrition-chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mealData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="#FF6B6B" name="Calories" />
                  <Bar dataKey="protein" fill="#4ECDC4" name="Protein (g)" />
                  <Bar dataKey="carbs" fill="#FFD166" name="Carbs (g)" />
                  <Bar dataKey="fat" fill="#6A0572" name="Fat (g)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="strength" className="strength-chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={strengthData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="squat"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Squat (lbs)"
                  />
                  <Line
                    type="monotone"
                    dataKey="deadlift"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Deadlift (lbs)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bench"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Bench Press (lbs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
