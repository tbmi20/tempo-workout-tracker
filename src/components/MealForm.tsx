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
      newFoodItems[index][field] = value as string;
    } else {
      newFoodItems[index][field] = Number(value);
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
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mealToEdit ? "Edit Meal" : "Log a Meal"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Meal Name */}
          <div className="grid gap-2">
            <Label htmlFor="meal-name">Meal Name (optional)</Label>
            <Input 
              id="meal-name" 
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., Morning Oatmeal, Lunch at Work"
            />
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Meal Type */}
            <div className="col-span-6 grid gap-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger id="meal-type">
                  <SelectValue placeholder="Select meal type" />
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
            <div className="col-span-6 grid gap-2">
              <Label htmlFor="meal-time">Time</Label>
              <Input 
                id="meal-time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                placeholder="e.g., 8:30 AM"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Food Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFoodItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

            <ScrollArea className="h-[250px] pr-4">
              {foodItems.map((item, index) => (
                <Card key={item.id} className="bg-muted/30 mb-3">
                  <CardContent className="py-3">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12 sm:col-span-4">
                        <Label htmlFor={`food-name-${index}`} className="text-sm">Food Name</Label>
                        <Input
                          id={`food-name-${index}`}
                          value={item.name}
                          onChange={(e) =>
                            handleFoodItemChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Chicken Breast"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label htmlFor={`calories-${index}`} className="text-sm">Calories</Label>
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
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label htmlFor={`protein-${index}`} className="text-sm">Protein (g)</Label>
                        <Input
                          id={`protein-${index}`}
                          type="number"
                          value={item.protein}
                          onChange={(e) =>
                            handleFoodItemChange(index, "protein", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label htmlFor={`carbs-${index}`} className="text-sm">Carbs (g)</Label>
                        <Input
                          id={`carbs-${index}`}
                          type="number"
                          value={item.carbs}
                          onChange={(e) =>
                            handleFoodItemChange(index, "carbs", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-1">
                        <Label htmlFor={`fat-${index}`} className="text-sm">Fat (g)</Label>
                        <Input
                          id={`fat-${index}`}
                          type="number"
                          value={item.fat}
                          onChange={(e) =>
                            handleFoodItemChange(index, "fat", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFoodItem(index)}
                          disabled={foodItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="meal-notes">Notes (optional)</Label>
            <Textarea
              id="meal-notes"
              value={mealNotes}
              onChange={(e) => setMealNotes(e.target.value)}
              placeholder="How did you feel after this meal? Any additional notes?"
              className="resize-none"
              rows={2}
            />
          </div>

          <Card className="bg-primary/5">
            <CardContent className="py-3">
              <h3 className="text-base font-medium mb-2">Meal Summary</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-lg font-bold">{totals.calories}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-lg font-bold">{totals.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-lg font-bold">{totals.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-lg font-bold">{totals.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mealToEdit ? "Update Meal" : "Save Meal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealForm;
