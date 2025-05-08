import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

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

// Helper functions for workout template operations
export const templateService = {
  async getTemplates() {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*, template_exercises(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async addTemplate(template: any) {
    // First, add the template
    const { data: templateData, error: templateError } = await supabase
      .from('workout_templates')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: template.name,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (templateError) throw templateError;
    
    // If exercises exist, add them too
    if (template.exercises && template.exercises.length > 0) {
      const exercises = template.exercises.map((exercise: any) => ({
        template_id: templateData.id,
        name: exercise.name,
        sets: exercise.sets
      }));
      
      const { error: exerciseError } = await supabase
        .from('template_exercises')
        .insert(exercises);
      
      if (exerciseError) throw exerciseError;
    }
    
    return templateData;
  },
  
  async updateTemplate(id: string, template: any) {
    const { data, error } = await supabase
      .from('workout_templates')
      .update({
        name: template.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // If exercises exist, delete old ones and add new ones
    if (template.exercises && template.exercises.length > 0) {
      // Delete old exercises
      const { error: deleteError } = await supabase
        .from('template_exercises')
        .delete()
        .eq('template_id', id);
      
      if (deleteError) throw deleteError;
      
      // Add new exercises
      const exercises = template.exercises.map((exercise: any) => ({
        template_id: id,
        name: exercise.name,
        sets: exercise.sets
      }));
      
      const { error: exerciseError } = await supabase
        .from('template_exercises')
        .insert(exercises);
      
      if (exerciseError) throw exerciseError;
    }
    
    return data;
  },
  
  async deleteTemplate(id: string) {
    const { error } = await supabase
      .from('workout_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  async useTemplate(templateId: string) {
    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('workout_templates')
      .select('*, template_exercises(*)')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw templateError;
    
    // Create a new workout from template
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: template.name,
        duration: 45, // Default duration in minutes
        notes: `Created from template: ${template.name}`,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (workoutError) throw workoutError;
    
    // Add exercises from template
    if (template.template_exercises && template.template_exercises.length > 0) {
      const exercises = template.template_exercises.map((exercise: any) => ({
        workout_id: workoutData.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: 10, // Default values
        weight: 0 // Default values
      }));
      
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert(exercises);
      
      if (exerciseError) throw exerciseError;
    }
    
    return workoutData;
  }
};