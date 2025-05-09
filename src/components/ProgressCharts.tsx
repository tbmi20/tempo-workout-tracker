import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

  const workoutData = processWorkoutData();
  const mealData = processMealData();

  // Generate sample data for strength progress if not enough real data
  const strengthData = workouts.length < 3 ? [
    { name: "Week 1", squat: 135, deadlift: 185, bench: 95 },
    { name: "Week 2", squat: 145, deadlift: 195, bench: 100 },
    { name: "Week 3", squat: 155, deadlift: 205, bench: 105 },
    { name: "Week 4", squat: 165, deadlift: 215, bench: 115 }
  ] : []; // In a real app, you'd process real strength data here

  return (
    <Card className="relative overflow-hidden" ref={chartRef}>
      <CardHeader>
        <CardTitle>Fitness Progress</CardTitle>
        <CardDescription>
          Track your fitness journey over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="w-full">
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
                  <Bar dataKey="protein" name="Protein (g)" fill="#8884d8" />
                  <Bar dataKey="carbs" name="Carbs (g)" fill="#82ca9d" />
                  <Bar dataKey="fat" name="Fat (g)" fill="#ffc658" />
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
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deadlift" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bench" 
                    stroke="#ffc658" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
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
