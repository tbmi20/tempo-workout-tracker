import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  // In a real app, you would have actual set data
  // For now, we'll generate this from the exercise data
  setDetails?: ExerciseSet[];
}

interface WorkoutDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout?: {
    id: number;
    name: string;
    date: string;
    duration: string;
    exercises: Exercise[];
  };
}

const WorkoutDetailDialog: React.FC<WorkoutDetailDialogProps> = ({ 
  open, 
  onOpenChange, 
  workout 
}) => {
  if (!workout) return null;

  // Generate detailed set data for each exercise if not provided
  // In a real app, this would come from your database
  const workoutWithSets = {
    ...workout,
    exercises: workout.exercises.map(exercise => {
      if (exercise.setDetails) return exercise;

      // Generate mock set details based on exercise data
      const setDetails = Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: exercise.reps,
        weight: exercise.weight,
      }));

      return {
        ...exercise,
        setDetails,
      };
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{workout.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Calendar className="h-4 w-4" /> {workout.date}
            <span className="mx-1">•</span>
            <Clock className="h-4 w-4" /> {workout.duration}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">Exercise Details</h3>
          
          <Accordion type="single" collapsible className="w-full">
            {workoutWithSets.exercises.map((exercise, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-medium">{exercise.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {exercise.sets} sets × {exercise.reps} reps
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Set</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exercise.setDetails?.map((set) => (
                        <TableRow key={set.setNumber}>
                          <TableCell>{set.setNumber}</TableCell>
                          <TableCell>{set.reps}</TableCell>
                          <TableCell className="text-right">
                            {set.weight > 0 ? `${set.weight} lbs` : "BW"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDetailDialog;