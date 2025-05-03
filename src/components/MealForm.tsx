import React, { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";

interface MealFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (mealData: MealData) => void;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealData {
  mealType: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MealForm = ({ open = true, onOpenChange, onSave }: MealFormProps) => {
  const [mealType, setMealType] = useState<string>("breakfast");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
  ]);

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
      { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]);
  };

  const handleRemoveFoodItem = (index: number) => {
    const newFoodItems = [...foodItems];
    newFoodItems.splice(index, 1);
    setFoodItems(
      newFoodItems.length
        ? newFoodItems
        : [{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }],
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
    const mealData: MealData = {
      mealType,
      foodItems,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    };

    if (onSave) {
      onSave(mealData);
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
          <DialogTitle className="text-xl font-bold">Log a Meal</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
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

          <div className="space-y-4">
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

            {foodItems.map((item, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 sm:col-span-4">
                      <Label htmlFor={`food-name-${index}`}>Food Name</Label>
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
                      <Label htmlFor={`calories-${index}`}>Calories</Label>
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
                      <Label htmlFor={`protein-${index}`}>Protein (g)</Label>
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
                      <Label htmlFor={`carbs-${index}`}>Carbs (g)</Label>
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
                      <Label htmlFor={`fat-${index}`}>Fat (g)</Label>
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
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-2">Meal Summary</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold">{totals.calories}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xl font-bold">{totals.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xl font-bold">{totals.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xl font-bold">{totals.fat}g</p>
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
          <Button onClick={handleSave}>Save Meal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealForm;
