// filepath: /Users/tbmi/Documents/GitHub/tempo-workout-tracker/src/components/WorkoutTemplateForm.tsx
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

interface TemplateExercise {
  id: string;
  name: string;
  sets: number;
}

interface WorkoutTemplateFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (template: { name: string; exercises: TemplateExercise[] }) => void;
}

const WorkoutTemplateForm = ({ 
  open, 
  onOpenChange, 
  onSave 
}: WorkoutTemplateFormProps) => {
  const [templateName, setTemplateName] = useState<string>("New Workout Template");
  const [exercises, setExercises] = useState<TemplateExercise[]>([
    { id: "1", name: "Bench Press", sets: 3 },
    { id: "2", name: "Squats", sets: 4 },
  ]);

  const exerciseTypes = [
    "Bench Press",
    "Squats",
    "Deadlift",
    "Pull-ups",
    "Push-ups",
    "Lunges",
    "Shoulder Press",
    "Bicep Curls",
    "Tricep Extensions",
    "Leg Press",
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const addExercise = () => {
    const newExercise: TemplateExercise = {
      id: Date.now().toString(),
      name: exerciseTypes[0],
      sets: 3,
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const updateExercise = (
    id: string,
    field: keyof TemplateExercise,
    value: string | number,
  ) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === id) {
          return { ...exercise, [field]: value };
        }
        return exercise;
      }),
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ name: templateName, exercises });
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Workout Template</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              type="text"
              value={templateName}
              onChange={handleNameChange}
              placeholder="Enter a name for this template"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button
                onClick={addExercise}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            </div>

            {exercises.map((exercise) => (
              <Card key={exercise.id} className="bg-gray-50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-8">
                      <Label htmlFor={`exercise-${exercise.id}`}>
                        Exercise
                      </Label>
                      <Select
                        value={exercise.name}
                        onValueChange={(value) =>
                          updateExercise(exercise.id, "name", value)
                        }
                      >
                        <SelectTrigger id={`exercise-${exercise.id}`}>
                          <SelectValue placeholder="Select exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {exerciseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                      <Input
                        id={`sets-${exercise.id}`}
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            "sets",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-1 flex items-end justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {exercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No exercises added. Click "Add Exercise" to start building your template.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutTemplateForm;