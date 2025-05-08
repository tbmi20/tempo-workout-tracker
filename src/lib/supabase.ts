import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client with the kinnikuman project credentials
const supabaseUrl = 'https://odziocmgjlhkjalvvnig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kemlvY21namxoa2phbHZ2bmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY2OTEsImV4cCI6MjA2MTk3MjY5MX0.nuMKLC6Z7esXIZFKwufAthw956sqJbl3bCenahNxKfk';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper functions for workout operations
export const workoutService = {
  async getWorkouts() {
    const { data, error } = await supabase
      .from('workouts')
      .select('*, exercises(*)')
      .order('completed_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async addWorkout(workout: any) {
    // First, add the workout
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: workout.name,
        duration: workout.duration,
        notes: workout.notes || '',
        completed_at: workout.completed_at || new Date().toISOString()
      })
      .select()
      .single();
    
    if (workoutError) throw workoutError;
    
    // If exercises exist, add them too
    if (workout.exercises && workout.exercises.length > 0) {
      const exercises = workout.exercises.map((exercise: any) => ({
        workout_id: workoutData.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || null,
        notes: exercise.notes || ''
      }));
      
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert(exercises);
      
      if (exerciseError) throw exerciseError;
    }
    
    return workoutData;
  },
  
  async updateWorkout(id: string, workout: any) {
    const { data, error } = await supabase
      .from('workouts')
      .update({
        name: workout.name,
        duration: workout.duration,
        notes: workout.notes || '',
        completed_at: workout.completed_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async deleteWorkout(id: string) {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Helper functions for meal operations
export const mealService = {
  async getMeals() {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('consumed_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async addMeal(meal: any) {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: meal.name,
        meal_type: meal.meal_type,
        calories: meal.calories,
        protein: meal.protein || null,
        carbs: meal.carbs || null,
        fat: meal.fat || null,
        notes: meal.notes || '',
        consumed_at: meal.consumed_at || new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateMeal(id: string, meal: any) {
    const { data, error } = await supabase
      .from('meals')
      .update({
        name: meal.name,
        meal_type: meal.meal_type,
        calories: meal.calories,
        protein: meal.protein || null,
        carbs: meal.carbs || null,
        fat: meal.fat || null,
        notes: meal.notes || '',
        consumed_at: meal.consumed_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async deleteMeal(id: string) {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};