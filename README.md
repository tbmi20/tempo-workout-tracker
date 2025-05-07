# Tempo Workout Tracker

A modern fitness tracking application built with React, TypeScript, and Vite that enables users to track their workouts, nutrition, and fitness progress.

## Overview

Tempo Workout Tracker is a comprehensive fitness application that helps users manage their fitness journey by tracking:

- Workouts and exercise routines
- Meal diary and nutrition intake
- Fitness progress through visual charts
- Custom workout templates

## Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Shadcn UI components
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Chart.js, Recharts
- **Backend Integration**: Supabase
- **Routing**: React Router
- **Icons**: Lucide React

## Project Structure

- `/src`: Source code
  - `/components`: UI components
    - `/ui`: Reusable UI components from Shadcn UI
    - `home.tsx`: Main application homepage
    - `WorkoutForm.tsx`: Form for logging workouts
    - `WorkoutTemplateForm.tsx`: Form for creating workout templates
    - `MealForm.tsx`: Form for logging meals
    - `MealDiary.tsx`: Component for viewing meal history
    - `ProgressCharts.tsx`: Charts for visualizing progress
    - `SummaryCards.tsx`: Daily summary statistics
  - `/contexts`: React contexts for state management
    - `MealDiaryContext.tsx`: Context for meal diary state management
  - `/lib`: Utility functions
  - `/types`: TypeScript type definitions
    - `supabase.ts`: Supabase database types
  - `/stories`: Storybook stories for UI components

## Key Features

### Workout Tracking
- Log completed workouts with exercises, sets, reps, and weights
- Create and manage reusable workout templates
- View workout history

### Nutrition Tracking
- Log meals with food items, calories, and macronutrients
- Track daily caloric intake
- Categorize meals by type (breakfast, lunch, dinner, snacks)

### Progress Visualization
- View fitness progress through interactive charts
- Track key metrics like weight, strength gains, and nutritional data

### Dashboard
- Summary view of daily activity
- Quick access to workout and meal logging

## Getting Started

### Installation

```bash
# Clone repository
git clone [repo-url]
cd tempo-workout-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory with:

```
VITE_TEMPO=false
SUPABASE_PROJECT_ID=your_supabase_project_id
```

### Supabase Types

To update the Supabase TypeScript types:

```bash
npm run types:supabase
```

## Building for Production

```bash
npm run build
```

## Project Configuration

The project includes several configuration files:
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build tool configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - Shadcn UI components configuration
- `tempo.config.json` - Tempo-specific configuration

---

**Note to AI Agents**: This README provides the key information needed to understand the Tempo Workout Tracker application. Please update this documentation whenever making relevant changes to the application structure, features, or dependencies.
