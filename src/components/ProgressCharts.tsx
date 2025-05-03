import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ChartData {
  labels: string[];
  values: number[];
}

interface ProgressChartsProps {
  workoutData?: ChartData;
  nutritionData?: ChartData;
  weightData?: ChartData;
}

const ProgressCharts = ({
  workoutData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [30, 45, 0, 60, 25, 50, 0],
  },
  nutritionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [2100, 1950, 2300, 2000, 2200, 2500, 2150],
  },
  weightData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    values: [185, 183, 181, 180],
  },
}: ProgressChartsProps) => {
  const [timeRange, setTimeRange] = useState("week");

  // Function to render a simple bar chart
  const renderBarChart = (data: ChartData, color: string, unit: string) => {
    const maxValue = Math.max(...data.values) * 1.2; // Add 20% padding

    return (
      <div className="w-full h-64 mt-4">
        <div className="flex h-full items-end space-x-2">
          {data.labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full ${color} rounded-t-md transition-all duration-300 ease-in-out`}
                style={{ height: `${(data.values[index] / maxValue) * 100}%` }}
              ></div>
              <div className="text-xs mt-2 text-muted-foreground">{label}</div>
              <div className="text-sm font-medium">
                {data.values[index]}
                {unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render a simple line chart (for weight progress)
  const renderLineChart = (data: ChartData, color: string, unit: string) => {
    const maxValue = Math.max(...data.values) * 1.1; // Add 10% padding
    const minValue = Math.min(...data.values) * 0.9; // Subtract 10% padding
    const range = maxValue - minValue;

    // Calculate points for the SVG polyline
    const points = data.values
      .map((value, index) => {
        const x = (index / (data.values.length - 1)) * 100;
        const y = 100 - ((value - minValue) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="w-full h-64 mt-4">
        <div className="relative w-full h-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={points}
              fill="none"
              stroke={
                color === "bg-primary"
                  ? "hsl(var(--primary))"
                  : "hsl(var(--secondary))"
              }
              strokeWidth="2"
            />
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {data.labels.map((label, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {label}
              </div>
            ))}
          </div>

          <div className="absolute top-0 right-0 flex flex-col justify-between h-full text-xs text-muted-foreground">
            <div>
              {Math.round(maxValue)}
              {unit}
            </div>
            <div>
              {Math.round(minValue)}
              {unit}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          {data.labels.map((label, index) => (
            <div key={index} className="text-sm font-medium">
              {data.values[index]}
              {unit}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">Workout Progress</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Progress</TabsTrigger>
          <TabsTrigger value="weight">Weight Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Duration (minutes)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart(workoutData, "bg-primary", "min")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart(nutritionData, "bg-secondary", "cal")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking (lbs)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderLineChart(weightData, "bg-primary", "lbs")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressCharts;
