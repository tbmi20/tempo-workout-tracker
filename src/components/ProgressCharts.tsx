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
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  values: number[];
}

interface ProgressChartsProps {
  workoutData?: ChartData;
  caloriesBurnedData?: ChartData;
  nutritionData?: ChartData;
  weightData?: ChartData;
}

const ProgressCharts = ({
  caloriesBurnedData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [320, 450, 0, 580, 250, 520, 0],
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Function to handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    
    // Update date range based on selected time range
    const today = new Date();
    let from: Date;
    
    switch (value) {
      case "week":
        from = subDays(today, 7);
        break;
      case "month":
        from = subDays(today, 30);
        break;
      case "year":
        from = subDays(today, 365);
        break;
      default:
        from = subDays(today, 7);
    }
    
    setDateRange({ from, to: today });
  };

  // Function to handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      // If a custom date range is selected, set timeRange to "custom"
      if (range.from && range.to) {
        setTimeRange("custom");
      }
    }
  };

  // Function to convert our ChartData format to Chart.js format
  const convertToChartJsData = (data: ChartData, label: string, color: string, backgroundColor: string) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label,
          data: data.values,
          backgroundColor,
          borderColor: color,
          borderWidth: 1,
        },
      ],
    };
  };

  // Common chart options
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} cal`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Line chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} lbs`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range">
                {timeRange === "custom" 
                  ? "Custom Range" 
                  : timeRange === "week" 
                  ? "Last 7 days" 
                  : timeRange === "month" 
                  ? "Last 30 days" 
                  : "Last 12 months"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              {timeRange === "custom" && <SelectItem value="custom">Custom Range</SelectItem>}
            </SelectContent>
          </Select>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(isCalendarOpen && "border-primary")}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                footer={
                  <div className="px-4 pt-0 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          "Select a date range"
                        )}
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => setIsCalendarOpen(false)}
                        className="ml-4"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="calories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calories">Calories Burned</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Progress</TabsTrigger>
          <TabsTrigger value="weight">Weight Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="calories" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calories Burned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <Bar 
                  options={barChartOptions} 
                  data={convertToChartJsData(
                    caloriesBurnedData, 
                    'Calories Burned', 
                    'rgb(249, 115, 22)', // Tailwind orange-500
                    'rgba(249, 115, 22, 0.5)'
                  )} 
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <Bar 
                  options={barChartOptions}
                  data={convertToChartJsData(
                    nutritionData, 
                    'Calorie Intake', 
                    'hsl(var(--secondary))', 
                    'hsla(var(--secondary), 0.5)'
                  )} 
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking (lbs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <Line 
                  options={lineChartOptions}
                  data={convertToChartJsData(
                    weightData, 
                    'Weight', 
                    'hsl(var(--primary))', 
                    'hsla(var(--primary), 0.2)'
                  )} 
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressCharts;
