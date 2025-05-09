# Test info

- Name: Header should be visible and Login/Register button accessible
- Location: /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:63:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('header')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('header')

    at /Users/tbmi/Documents/GitHub/tempo-workout-tracker/tests/playwright/home.test.ts:71:24
```

# Page snapshot

```yaml
- text: Tempo Workout Tracker
- heading "Log In" [level=3]
- paragraph: Sign in to access your workout tracker
- text: Email
- textbox "Email"
- text: Password
- textbox "Password"
- button "Sign In"
- button "Forgot password?"
- text: Don't have an account?
- button "Sign up"
- text: © 2025 Tempo Workout Tracker. All rights reserved.
- region "Notifications (F8)":
  - list
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
> 71 |   await expect(header).toBeVisible();
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
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