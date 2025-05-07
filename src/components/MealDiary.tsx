import React, { useState } from "react";
import { format, parseISO, startOfDay, endOfDay, addDays, subDays } from "date-fns";
import { useMealDiary, MealEntry } from "@/contexts/MealDiaryContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Edit,
  Trash2,
  PlusCircle,
  UtensilsCrossed,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import MealForm from "./MealForm";

const MealDiary = () => {
  const { mealsByDate, meals, getTotalCaloriesByDate, deleteMeal } = useMealDiary();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const readableDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const mealsForSelectedDate = mealsByDate[formattedDate] || [];
  const totalCalories = getTotalCaloriesByDate(formattedDate);
  
  const navigateDate = (direction: 'next' | 'prev') => {
    setSelectedDate(currentDate => 
      direction === 'next' 
        ? addDays(currentDate, 1) 
        : subDays(currentDate, 1)
    );
  };
  
  const handleAddMeal = () => {
    setEditingMeal(null);
    setMealDialogOpen(true);
  };
  
  const handleEditMeal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setMealDialogOpen(true);
  };
  
  const handleDeleteMeal = (id: string) => {
    deleteMeal(id);
  };
  
  // Group meals by meal type
  const mealsByType = mealsForSelectedDate.reduce((acc: { [key: string]: MealEntry[] }, meal) => {
    const type = meal.mealType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(meal);
    return acc;
  }, {});
  
  const mealTypeOrder = ["breakfast", "lunch", "dinner", "snack"];
  const sortedMealTypes = Object.keys(mealsByType).sort(
    (a, b) => mealTypeOrder.indexOf(a) - mealTypeOrder.indexOf(b)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 px-2 font-normal"
              >
                <Calendar className="h-4 w-4" />
                {readableDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleAddMeal}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Log Meal</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/20 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Meal Diary</CardTitle>
              <CardDescription>
                {readableDate} • {totalCalories} total calories
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-normal px-3">
              {mealsForSelectedDate.length} {mealsForSelectedDate.length === 1 ? 'meal' : 'meals'} logged
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {mealsForSelectedDate.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {sortedMealTypes.map((type) => (
                  <div key={type} className="space-y-3">
                    <h3 className="text-lg font-medium capitalize">
                      {type === "breakfast" && "Breakfast"}
                      {type === "lunch" && "Lunch"}
                      {type === "dinner" && "Dinner"}
                      {type === "snack" && "Snacks"}
                    </h3>
                    <div className="space-y-3">
                      {mealsByType[type].map((meal) => (
                        <Card key={meal.id} className="border-l-4 border-l-green-500/70">
                          <CardHeader className="py-3 px-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-semibold">
                                  {meal.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-sm mt-1">
                                  <Clock className="h-3 w-3" /> {meal.time}
                                  <span className="mx-1">•</span>
                                  <Badge variant="secondary">{meal.calories} calories</Badge>
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditMeal(meal)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteMeal(meal.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 px-4">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="items" className="border-b-0">
                                <AccordionTrigger className="py-2 text-sm">
                                  {meal.items.length} food items
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-2 text-sm">
                                    {meal.items.map((item, index) => (
                                      <div
                                        key={item.id}
                                        className="flex justify-between py-1 border-b border-dashed border-muted last:border-0"
                                      >
                                        <span className="font-medium">{item.name}</span>
                                        <div className="flex gap-3">
                                          <span>{item.calories} cal</span>
                                          <span className="text-muted-foreground">{item.protein}p</span>
                                          <span className="text-muted-foreground">{item.carbs}c</span>
                                          <span className="text-muted-foreground">{item.fat}f</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                          {meal.notes && (
                            <CardFooter className="bg-muted/10 py-2 px-4 text-sm italic">
                              "{meal.notes}"
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No meals logged for this day</h3>
              <p className="text-muted-foreground max-w-xs">
                Track your meals to monitor your nutrition intake and build healthy eating habits.
              </p>
              <Button className="mt-2" onClick={handleAddMeal}>
                Log Your First Meal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MealForm
        open={mealDialogOpen}
        onOpenChange={setMealDialogOpen}
        mealToEdit={editingMeal}
        selectedDate={formattedDate}
      />
    </div>
  );
};

export default MealDiary;