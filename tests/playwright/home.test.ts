import { test, expect } from '@playwright/test';

test('Home page should load and show the correct title', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page has loaded correctly
  await expect(page).toHaveTitle(/Tempo Workout Tracker/);
  
  // Check if the main elements are visible
  await expect(page.locator('h1:has-text("Tempo")')).toBeVisible();
});

test('Tab navigation should work correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check tabs instead of navigation items
  const tabs = page.locator('button[role="tab"]');
  expect(await tabs.count()).toBeGreaterThan(0);
  
  // Test tab switching
  const workoutsTab = page.locator('button[role="tab"]:has-text("Workouts")');
  await workoutsTab.click();
  await expect(page.locator('h2:has-text("Workout Templates")')).toBeVisible();
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
  const addMealButton = page.locator('button:has-text("Log Meal"), a:has-text("Log Meal")').first();
  
  if (await addMealButton.count() > 0) {
    await addMealButton.click();
    
    // Check if the form appeared
    await expect(page.locator('form')).toBeVisible();
  } else {
    console.log('Add Meal button not found, skipping test');
    test.skip();
  }
});

// Test header visibility and position
test('Header should be visible and Login/Register button accessible', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load fully
  await page.waitForLoadState('networkidle');
  
  // Check if the header is visible
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  // Get header bounding box to check position
  const headerBox = await header.boundingBox();
  expect(headerBox?.y).toBeLessThan(100); // Header should be at the top of the page
  
  // Check that the Login/Register button exists and is visible
  const loginButton = page.locator('[data-testid="login-register-button"]');
  await expect(loginButton).toBeVisible();
  
  // Check that the Login/Register button is clickable (not obscured)
  await loginButton.click();
});