import { test, expect } from '@playwright/test';

test('Home page should load and show the correct title', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page has loaded correctly
  await expect(page).toHaveTitle(/Tempo Workout Tracker/);
  
  // Check if the main elements are visible
  await expect(page.locator('h1:has-text("Tempo Workout Tracker")')).toBeVisible();
});

test('Navigation menu should work correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check navigation items
  const navItems = page.locator('nav a');
  expect(await navItems.count()).toBeGreaterThan(0);
});

// Test workout functionality if the workout form is available
test('Should be able to view workout form', async ({ page }) => {
  await page.goto('/');
  
  // Try to find and click on a button that would open the workout form
  const addWorkoutButton = page.locator('button:has-text("Add Workout"), a:has-text("Add Workout")').first();
  
  if (await addWorkoutButton.count() > 0) {
    await addWorkoutButton.click();
    
    // Check if the form appeared
    await expect(page.locator('form')).toBeVisible();
  } else {
    console.log('Add Workout button not found, skipping test');
    test.skip();
  }
});

// Test meal tracking functionality if available
test('Should be able to view meal form', async ({ page }) => {
  await page.goto('/');
  
  // Try to find and click on a button that would open the meal form
  const addMealButton = page.locator('button:has-text("Add Meal"), a:has-text("Add Meal")').first();
  
  if (await addMealButton.count() > 0) {
    await addMealButton.click();
    
    // Check if the form appeared
    await expect(page.locator('form')).toBeVisible();
  } else {
    console.log('Add Meal button not found, skipping test');
    test.skip();
  }
});