# Test info

- Name: Should be able to view workout form
- Location: /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:22:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('form')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('form')

    at /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:32:40
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- dialog "Log Workout":
  - heading "Log Workout" [level=2]
  - text: Workout Name
  - textbox "Workout Name": New Workout
  - text: Workout Date
  - textbox "Workout Date": 2025-05-08
  - heading "Exercises" [level=3]
  - button "Add Exercise":
    - img
    - text: Add Exercise
  - text: Exercise
  - combobox "Exercise": Bench Press
  - text: Sets
  - spinbutton "Sets": "3"
  - text: Reps
  - spinbutton "Reps": "10"
  - text: Weight
  - spinbutton "Weight": "135"
  - button:
    - img
  - text: Exercise
  - combobox "Exercise": Squats
  - text: Sets
  - spinbutton "Sets": "4"
  - text: Reps
  - spinbutton "Reps": "8"
  - text: Weight
  - spinbutton "Weight": "185"
  - button:
    - img
  - button "Cancel"
  - button "Save Workout"
  - button "Close":
    - img
    - text: Close
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Home page should load and show the correct title', async ({ page }) => {
   4 |   await page.goto('/');
   5 |   
   6 |   // Check if the page has loaded correctly
   7 |   await expect(page).toHaveTitle(/Tempo Workout Tracker/);
   8 |   
   9 |   // Check if the main elements are visible
  10 |   await expect(page.locator('h1:has-text("Tempo Workout Tracker")')).toBeVisible();
  11 | });
  12 |
  13 | test('Navigation menu should work correctly', async ({ page }) => {
  14 |   await page.goto('/');
  15 |   
  16 |   // Check navigation items
  17 |   const navItems = page.locator('nav a');
  18 |   expect(await navItems.count()).toBeGreaterThan(0);
  19 | });
  20 |
  21 | // Test workout functionality if the workout form is available
  22 | test('Should be able to view workout form', async ({ page }) => {
  23 |   await page.goto('/');
  24 |   
  25 |   // Try to find and click on a button that would open the workout form
  26 |   const addWorkoutButton = page.locator('button:has-text("Add Workout"), a:has-text("Add Workout")').first();
  27 |   
  28 |   if (await addWorkoutButton.count() > 0) {
  29 |     await addWorkoutButton.click();
  30 |     
  31 |     // Check if the form appeared
> 32 |     await expect(page.locator('form')).toBeVisible();
     |                                        ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  33 |   } else {
  34 |     console.log('Add Workout button not found, skipping test');
  35 |     test.skip();
  36 |   }
  37 | });
  38 |
  39 | // Test meal tracking functionality if available
  40 | test('Should be able to view meal form', async ({ page }) => {
  41 |   await page.goto('/');
  42 |   
  43 |   // Try to find and click on a button that would open the meal form
  44 |   const addMealButton = page.locator('button:has-text("Add Meal"), a:has-text("Add Meal")').first();
  45 |   
  46 |   if (await addMealButton.count() > 0) {
  47 |     await addMealButton.click();
  48 |     
  49 |     // Check if the form appeared
  50 |     await expect(page.locator('form')).toBeVisible();
  51 |   } else {
  52 |     console.log('Add Meal button not found, skipping test');
  53 |     test.skip();
  54 |   }
  55 | });
  56 |
  57 | // Test header visibility and position
  58 | test('Header should be visible and Login/Register button accessible', async ({ page }) => {
  59 |   await page.goto('/');
  60 |   
  61 |   // Wait for page to load fully
  62 |   await page.waitForLoadState('networkidle');
  63 |   
  64 |   // Check if the header is visible
  65 |   const header = page.locator('header');
  66 |   await expect(header).toBeVisible();
  67 |   
  68 |   // Get header bounding box to check position
  69 |   const headerBox = await header.boundingBox();
  70 |   expect(headerBox?.y).toBeLessThan(100); // Header should be at the top of the page
  71 |   
  72 |   // Check that the Login/Register button exists and is visible
  73 |   const loginButton = page.locator('[data-testid="login-register-button"]');
  74 |   await expect(loginButton).toBeVisible();
  75 |   
  76 |   // Check that the Login/Register button is clickable (not obscured)
  77 |   await loginButton.click();
  78 | });
```