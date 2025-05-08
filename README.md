# Tempo Workout Tracker

A modern fitness tracking application built with React, TypeScript, and Vite that enables users to track their workouts, nutrition, and fitness progress with beautiful animations and a robust backend.

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
- **Animations**: GSAP (GreenSock Animation Platform)
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts for interactive charts
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Toast Notifications**: Shadcn UI toasts for user feedback
- **Testing**: Playwright with MCP (Model Context Protocol) server

## Project Structure

- `/src`: Source code
  - `/components`: UI components
    - `/ui`: Reusable UI components from Shadcn UI
    - `home.tsx`: Main application homepage with GSAP animations
    - `WorkoutForm.tsx`: Form for logging workouts
    - `WorkoutTemplateForm.tsx`: Form for creating workout templates
    - `MealForm.tsx`: Form for logging meals
    - `MealDiary.tsx`: Component for viewing meal history
    - `ProgressCharts.tsx`: Animated charts for visualizing progress
    - `SummaryCards.tsx`: Daily summary statistics with animated counters
    - `WorkoutDetailDialog.tsx`: Detailed view of individual workouts
  - `/contexts`: React contexts for state management
    - `MealDiaryContext.tsx`: Context for meal diary state management
  - `/lib`: Utility functions
    - `supabase.ts`: Supabase client and API services with workout, meal, and template functionality
    - `utils.ts`: Utility functions
  - `/types`: TypeScript type definitions
    - `supabase.ts`: TypeScript definitions for Supabase database schema
  - `/stories`: Storybook stories for UI components
- `/tests`: Test files
  - `/playwright`: Playwright testing setup
    - `home.test.ts`: Basic tests for the home page
    - `mcp-server.ts`: Model Context Protocol server for automated testing
    - `run-mcp-server.ts`: Script to run the MCP server
  - `/videos`: Recorded test videos

## Key Features

### Workout Tracking
- Log completed workouts with exercises, sets, reps, and weights
- Create and manage reusable workout templates
- View workout history with animated cards
- Real-time synchronization with Supabase database
- Edit, delete, and view detailed workout information
- Copy templates to create variations of established routines

### Nutrition Tracking
- Log meals with food items, calories, and macronutrients
- Track daily caloric intake and macronutrient distribution
- Categorize meals by type (breakfast, lunch, dinner, snacks)
- Persistent storage in Supabase database
- Delete meal entries when needed

### Progress Visualization
- View fitness progress through interactive animated charts
- Track key metrics like workout frequency, duration, and intensity
- Monitor nutrition trends with customizable date ranges
- Strength progression tracking over time

### Dashboard
- Summary view of daily activity with animated statistics
- Quick access to workout and meal logging
- Beautiful GSAP animations for a polished user experience

### Template Management
- Create custom workout templates with specific exercises
- Edit existing templates to refine your routines
- Copy templates to create variations
- Convert templates into actual workouts with a single click
- Organize exercise routines for efficient workout planning

### Beautiful UI Animations
- GSAP-powered entrance animations for cards and elements
- Animated number counters for statistics
- Smooth transitions between tabs and sections
- Interactive chart animations
- Elastic and bounce effects for an engaging user interface
- Toast notifications with subtle animations for user feedback

### User Feedback
- Comprehensive toast notification system for all user actions
- Clear feedback on successful operations
- Error notifications when operations fail
- Animated toast components that don't interrupt the user experience

### Robust Backend Infrastructure
- Secure PostgreSQL database with Supabase
- Row-level security policies for data protection
- Comprehensive database schema for workouts, exercises, meals, and templates
- TypeScript integration with auto-generated types
- Real-time synchronization between UI and database

### Testing Infrastructure
- Playwright testing setup for automated UI testing
- Model Context Protocol (MCP) server for programmatic app control
- Test recording capabilities for debugging

## Interactive UI Elements

All interactive elements in the application are fully functional:

- **Add Workout Button**: Opens the workout form dialog to log a new workout
- **Log Meal Button**: Opens the meal form dialog to record nutritional intake
- **Add Template Button**: Opens the template form to create workout templates
- **Edit Buttons**: Allow editing of existing workouts and templates
- **Delete Buttons**: Remove workouts, templates, or meals with confirmation
- **Copy Button**: Duplicates workout templates for easy variations
- **Use Template Button**: Converts a template into an actual workout
- **View Details Buttons**: Shows comprehensive information about workouts
- **Tab Navigation**: Switch between Dashboard, Workouts, and Meals views

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

Create a `.env.local` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=https://odziocmgjlhkjalvvnig.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

The application uses Supabase as a backend. The database includes the following tables:
- `users` - User information and authentication
- `workouts` - Workout sessions tracking
- `exercises` - Individual exercises within workouts
- `meals` - Meal and nutrition tracking
- `workout_templates` - Reusable workout templates
- `template_exercises` - Exercises associated with templates

### Automated Testing

To run the Playwright MCP server for automated testing:

```bash
# Start the development server
npm run dev

# In a separate terminal, run the MCP server
npx tsx tests/playwright/run-mcp-server.ts
```

To run the tests:

```bash
npx playwright test
```

## Building for Production

```bash
npm run build
npm run preview
```

## Project Configuration

The project includes several configuration files:
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build tool configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - Shadcn UI components configuration
- `tempo.config.json` - Tempo-specific configuration
- `playwright.config.ts` - Playwright testing configuration

## Future Development
- User authentication flows
- Social sharing features
- Advanced workout analytics
- Personalized training recommendations
- Mobile app with React Native
- Enhanced data visualization
- Workout plan scheduling
- Achievement badges and gamification
- Integration with fitness wearables

---

## For AI Agents & Contributors

### Running Tests with Playwright

You can run any tests on this project using Playwright. The testing infrastructure is already set up and ready to use:

```bash
# Run all tests across all browsers
npx playwright test

# Run tests in a specific browser
npx playwright test --project=chromium

# Run a specific test file
npx playwright test home.test.ts

# Run tests in UI mode
npx playwright test --ui

# Generate test reports
npx playwright test --reporter=html
```

Test results will be available in the `playwright-report` directory.

### Updating Documentation

When making changes to the project, please update this README accordingly to ensure documentation stays current. Important areas to update include:

1. New features or components added
2. Changes to the project structure
3. Updated environment requirements
4. New dependencies
5. Changes to testing procedures

Maintaining up-to-date documentation is essential for both human developers and AI agents working on this project in the future.

---

**Note**: This README provides the key information needed to understand the Tempo Workout Tracker application. The application combines beautiful GSAP animations with a robust Supabase backend for a complete fitness tracking experience. All buttons and interactive elements are fully functional and connected to the Supabase database.
