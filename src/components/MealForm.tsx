import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useMealDiary, MealEntry, FoodItem } from "@/contexts/MealDiaryContext";

interface MealFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mealToEdit: MealEntry | null;
  selectedDate?: string;
}

const currentTime = () => {
  return format(new Date(), "h:mm a");
};

const MealForm = ({ open, onOpenChange, mealToEdit, selectedDate }: MealFormProps) => {
  const { addMeal, updateMeal } = useMealDiary();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<string>("breakfast");
  const [mealTime, setMealTime] = useState(currentTime());
  const [mealNotes, setMealNotes] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { id: uuidv4(), name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
  ]);

  // Reset form when dialog opens for creating a new meal
  useEffect(() => {
    if (open && !mealToEdit) {
      setMealName("");
      setMealType("breakfast");
      setMealTime(currentTime());
      setMealNotes("");
      setFoodItems([
        { id: uuidv4(), name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
      ]);
    }
  }, [open, mealToEdit]);

  // Populate form when editing an existing meal
  useEffect(() => {
    if (mealToEdit) {
      setMealName(mealToEdit.name);
      setMealType(mealToEdit.mealType);
      setMealTime(mealToEdit.time);
      setMealNotes(mealToEdit.notes || "");
      setFoodItems(mealToEdit.items);
    }
  }, [mealToEdit]);

  const calculateTotals = () => {
    return foodItems.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  };

  const handleAddFoodItem = () => {
    setFoodItems([
      ...foodItems,
      { id: uuidv4(), name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]);
  };

  const handleRemoveFoodItem = (index: number) => {
    const newFoodItems = [...foodItems];
    newFoodItems.splice(index, 1);
    setFoodItems(
      newFoodItems.length
        ? newFoodItems
        : [{ id: uuidv4(), name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }],
    );
  };

  const handleFoodItemChange = (
    index: number,
    field: keyof FoodItem,
    value: string | number,
  ) => {
    const newFoodItems = [...foodItems];
    if (field === "name") {
      newFoodItems[index].name = value as string;
    } else if (field === "calories") {
      newFoodItems[index].calories = Number(value);
    } else if (field === "protein") {
      newFoodItems[index].protein = Number(value);
    } else if (field === "carbs") {
      newFoodItems[index].carbs = Number(value);
    } else if (field === "fat") {
      newFoodItems[index].fat = Number(value);
    }
    setFoodItems(newFoodItems);
  };

  const handleSave = () => {
    const totals = calculateTotals();
    const date = selectedDate || format(new Date(), "yyyy-MM-dd");

    // Prepare meal data
    const mealData = {
      name: mealName || `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
      date,
      time: mealTime,
      mealType,
      calories: totals.calories,
      items: foodItems.filter(item => item.name.trim() !== ""),
      notes: mealNotes.trim() !== "" ? mealNotes : undefined,
    };

    // Either update existing meal or add new meal
    if (mealToEdit) {
      updateMeal(mealToEdit.id, mealData);
    } else {
      addMeal(mealData);
    }

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-bold">
            {mealToEdit ? "Edit Meal" : "Log a Meal"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-12 gap-4">
            {/* Meal Name */}
            <div className="col-span-12 sm:col-span-6 grid gap-1">
              <Label htmlFor="meal-name" className="text-xs">Meal Name (optional)</Label>
              <Input 
                id="meal-name" 
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Morning Oatmeal"
                className="h-8"
              />
            </div>

            {/* Meal Type */}
            <div className="col-span-6 sm:col-span-3 grid gap-1">
              <Label htmlFor="meal-type" className="text-xs">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger id="meal-type" className="h-8">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meal Time */}
            <div className="col-span-6 sm:col-span-3 grid gap-1">
              <Label htmlFor="meal-time" className="text-xs">Time</Label>
              <Input 
                id="meal-time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                placeholder="e.g., 8:30 AM"
                className="h-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Food Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFoodItem}
                className="h-7 px-2 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <ScrollArea className="h-[170px] pr-4">
              {foodItems.map((item, index) => (
                <Card key={item.id} className="bg-muted/30 mb-2">
                  <CardContent className="p-2">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 sm:col-span-4 grid gap-1">
                        <Label htmlFor={`food-name-${index}`} className="text-xs">Food Name</Label>
                        <Input
                          id={`food-name-${index}`}
                          value={item.name}
                          onChange={(e) =>
                            handleFoodItemChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Chicken Breast"
                          className="h-7 text-sm"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2 grid gap-1">
                        <Label htmlFor={`calories-${index}`} className="text-xs">Calories</Label>
                        <Input
                          id={`calories-${index}`}
                          type="number"
                          value={item.calories}
                          onChange={(e) =>
                            handleFoodItemChange(
                              index,
                              "calories",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="h-7 text-sm"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2 grid gap-1">
                        <Label htmlFor={`protein-${index}`} className="text-xs">Protein</Label>
                        <Input
                          id={`protein-${index}`}
                          type="number"
                          value={item.protein}
                          onChange={(e) =>
                            handleFoodItemChange(index, "protein", e.target.value)
                          }
                          placeholder="0"
                          className="h-7 text-sm"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2 grid gap-1">
                        <Label htmlFor={`carbs-${index}`} className="text-xs">Carbs</Label>
                        <Input
                          id={`carbs-${index}`}
                          type="number"
                          value={item.carbs}
                          onChange={(e) =>
                            handleFoodItemChange(index, "carbs", e.target.value)
                          }
                          placeholder="0"
                          className="h-7 text-sm"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 grid gap-1">
                        <Label htmlFor={`fat-${index}`} className="text-xs">Fat</Label>
                        <Input
                          id={`fat-${index}`}
                          type="number"
                          value={item.fat}
                          onChange={(e) =>
                            handleFoodItemChange(index, "fat", e.target.value)
                          }
                          placeholder="0"
                          className="h-7 text-sm"
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFoodItem(index)}
                          disabled={foodItems.length === 1}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>

          <div className="grid grid-cols-1 gap-1 mt-1">
            <Label htmlFor="meal-notes" className="text-xs">Notes (optional)</Label>
            <Textarea
              id="meal-notes"
              value={mealNotes}
              onChange={(e) => setMealNotes(e.target.value)}
              placeholder="How did you feel after this meal?"
              className="resize-none text-sm min-h-0"
              rows={1}
            />
          </div>

          <Card className="bg-primary/5 mt-1">
            <CardContent className="p-2">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-base font-bold">{totals.calories}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-base font-bold">{totals.protein}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-base font-bold">{totals.carbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="text-base font-bold">{totals.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            {mealToEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealForm;
