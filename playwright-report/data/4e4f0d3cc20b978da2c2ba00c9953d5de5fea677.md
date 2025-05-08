# Test info

- Name: Home page should load and show the correct title
- Location: /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:3:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)

Locator: locator(':root')
Expected pattern: /Tempo Workout Tracker/
Received string:  "Vite + React + TS"
Call log:
  - expect.toHaveTitle with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en">…</html>
      - unexpected value "Vite + React + TS"

    at /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:7:22
```

# Page snapshot

```yaml
- banner:
  - heading "Fitness Tracker" [level=1]
  - button "Login / Register":
    - img
    - text: Login / Register
  - button "Add Workout":
    - img
    - text: Add Workout
  - button "Log Meal":
    - img
    - text: Log Meal
- tablist:
  - tab "Dashboard" [selected]:
    - img
    - text: Dashboard
  - tab "Workouts":
    - img
    - text: Workouts
  - tab "Meals":
    - img
    - text: Meals
- tabpanel "Dashboard":
  - heading "Today's Summary" [level=2]
  - heading "Workouts" [level=3]
  - paragraph: Today's sessions
  - img
  - text: "0"
  - paragraph: No workouts today
  - heading "Active Minutes" [level=3]
  - paragraph: Total workout time
  - img
  - text: "0"
  - paragraph: No active minutes today
  - heading "Meals Logged" [level=3]
  - paragraph: Today's nutrition
  - img
  - text: "0"
  - paragraph: No meals logged today
  - heading "Calories" [level=3]
  - paragraph: Today's intake
  - img
  - text: "0"
  - paragraph: No calories tracked today
  - heading "Your Progress" [level=2]
  - heading "Fitness Progress" [level=3]
  - paragraph: Track your fitness journey over time
  - tablist:
    - tab "Activity" [selected]
    - tab "Nutrition"
    - tab "Strength"
  - tabpanel "Activity":
    - img: FriSatSunMonTueWedThu0123401234
    - list:
      - listitem:
        - img
        - text: Minutes
      - listitem:
        - img
        - text: Sessions
- region "Notifications (F8)":
  - list:
    - status:
      - text: Error loading data Could not load your data. Please try again later.
      - button:
        - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Home page should load and show the correct title', async ({ page }) => {
   4 |   await page.goto('/');
   5 |   
   6 |   // Check if the page has loaded correctly
>  7 |   await expect(page).toHaveTitle(/Tempo Workout Tracker/);
     |                      ^ Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)
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
  32 |     await expect(page.locator('form')).toBeVisible();
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