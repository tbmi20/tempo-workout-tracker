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
  - heading "Tempo" [level=1]
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
    - img: Fri Sat Sun Mon Tue Wed Thu 0 1 2 3 4 0 1 2 3 4
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
  10 |   await expect(page.locator('h1:has-text("Tempo")')).toBeVisible();
  11 | });
  12 |
  13 | test('Tab navigation should work correctly', async ({ page }) => {
  14 |   await page.goto('/');
  15 |   
  16 |   // Check tabs instead of navigation items
  17 |   const tabs = page.locator('button[role="tab"]');
  18 |   expect(await tabs.count()).toBeGreaterThan(0);
  19 |   
  20 |   // Test tab switching
  21 |   const workoutsTab = page.locator('button[role="tab"]:has-text("Workouts")');
  22 |   await workoutsTab.click();
  23 |   await expect(page.locator('h2:has-text("Workout Templates")')).toBeVisible();
  24 | });
  25 |
  26 | // Test workout functionality if the workout form is available
  27 | test('Should be able to view workout form', async ({ page }) => {
  28 |   await page.goto('/');
  29 |   
  30 |   // Try to find and click on a button that would open the workout form
  31 |   const addWorkoutButton = page.locator('button:has-text("Add Workout"), a:has-text("Add Workout")').first();
  32 |   
  33 |   if (await addWorkoutButton.count() > 0) {
  34 |     await addWorkoutButton.click();
  35 |     
  36 |     // Check if the form appeared
  37 |     await expect(page.locator('form')).toBeVisible();
  38 |   } else {
  39 |     console.log('Add Workout button not found, skipping test');
  40 |     test.skip();
  41 |   }
  42 | });
  43 |
  44 | // Test meal tracking functionality if available
  45 | test('Should be able to view meal form', async ({ page }) => {
  46 |   await page.goto('/');
  47 |   
  48 |   // Try to find and click on a button that would open the meal form
  49 |   const addMealButton = page.locator('button:has-text("Log Meal"), a:has-text("Log Meal")').first();
  50 |   
  51 |   if (await addMealButton.count() > 0) {
  52 |     await addMealButton.click();
  53 |     
  54 |     // Check if the form appeared
  55 |     await expect(page.locator('form')).toBeVisible();
  56 |   } else {
  57 |     console.log('Add Meal button not found, skipping test');
  58 |     test.skip();
  59 |   }
  60 | });
  61 |
  62 | // Test header visibility and position
  63 | test('Header should be visible and Login/Register button accessible', async ({ page }) => {
  64 |   await page.goto('/');
  65 |   
  66 |   // Wait for page to load fully
  67 |   await page.waitForLoadState('networkidle');
  68 |   
  69 |   // Check if the header is visible
  70 |   const header = page.locator('header');
  71 |   await expect(header).toBeVisible();
  72 |   
  73 |   // Get header bounding box to check position
  74 |   const headerBox = await header.boundingBox();
  75 |   expect(headerBox?.y).toBeLessThan(100); // Header should be at the top of the page
  76 |   
  77 |   // Check that the Login/Register button exists and is visible
  78 |   const loginButton = page.locator('[data-testid="login-register-button"]');
  79 |   await expect(loginButton).toBeVisible();
  80 |   
  81 |   // Check that the Login/Register button is clickable (not obscured)
  82 |   await loginButton.click();
  83 | });
```