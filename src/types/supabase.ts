export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          duration: number
          notes: string | null
          completed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          duration: number
          notes?: string | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          duration?: number
          notes?: string | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          sets: number
          reps: number
          weight: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          sets: number
          reps: number
          weight?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          sets?: number
          reps?: number
          weight?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          meal_type: string
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          notes: string | null
          consumed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          meal_type: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          notes?: string | null
          consumed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          meal_type?: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          notes?: string | null
          consumed_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_templates_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      template_exercises: {
        Row: {
          id: string
          template_id: string
          name: string
          sets: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          template_id: string
          name: string
          sets: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          template_id?: string
          name?: string
          sets?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_exercises_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helpful type aliases for common use cases
export type Tables = Database['public']['Tables']
export type User = Tables['users']['Row']
export type Workout = Tables['workouts']['Row']
export type Exercise = Tables['exercises']['Row']
export type Meal = Tables['meals']['Row']
export type WorkoutTemplate = Tables['workout_templates']['Row']
export type TemplateExercise = Tables['template_exercises']['Row']

// Insert types
export type InsertUser = Tables['users']['Insert']
export type InsertWorkout = Tables['workouts']['Insert']
export type InsertExercise = Tables['exercises']['Insert']
export type InsertMeal = Tables['meals']['Insert']
export type InsertWorkoutTemplate = Tables['workout_templates']['Insert']
export type InsertTemplateExercise = Tables['template_exercises']['Insert']

// Update types
export type UpdateUser = Tables['users']['Update']
export type UpdateWorkout = Tables['workouts']['Update']
export type UpdateExercise = Tables['exercises']['Update']
export type UpdateMeal = Tables['meals']['Update']
export type UpdateWorkoutTemplate = Tables['workout_templates']['Update']
export type UpdateTemplateExercise = Tables['template_exercises']['Update']