import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('successful login flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill in login form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Click login button
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for navigation and verify redirect
    await expect(page).toHaveURL('/flashcards');

    // Verify user is logged in (e.g., check for user menu)
    await expect(page.getByRole('button', { name: /user menu/i })).toBeVisible();
  });

  test('displays validation errors', async ({ page }) => {
    await page.goto('/auth/login');

    // Submit without filling form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('handles invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
