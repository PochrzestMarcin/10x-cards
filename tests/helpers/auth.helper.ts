import type { Page } from '@playwright/test';

export async function loginAsTestUser(page: Page) {
  console.log('Starting login process...');
  
  // Navigate to login page
  await page.goto('/auth/login');
  
  // Wait for the form to be ready
  await page.waitForSelector('form');

  // Get credentials from environment variables
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error('E2E_USERNAME and E2E_PASSWORD must be set in .env.test file');
  }

  // Fill in login form using proper selectors
  await page.fill('input[name="email"]', username);
  await page.fill('input[name="password"]', password);

  // Wait for and click the form submit button specifically
  const form = page.locator('form');
  const submitButton = form.getByRole('button', { name: /sign in/i });
  await submitButton.waitFor({ state: 'visible' });
  await submitButton.click();

  console.log('Form submitted, waiting for response...');

  try {
    // Wait for navigation and successful login
    await Promise.race([
      page.waitForURL('/generate'), // Success path - redirects to generate page
      page.waitForURL('/flashcards'), // Alternative success path
      page.waitForTimeout(5000) // Timeout if login fails
    ]);
  } catch (error) {
    console.error('Navigation error:', error);
    // Check for error messages on the page
    const errorText = await page.evaluate(() => {
      const errorElement = document.querySelector('.text-destructive');
      return errorElement ? errorElement.textContent : null;
    });
    if (errorText) {
      throw new Error(`Login failed - Form error: ${errorText}`);
    }
  }

  // Verify we're actually logged in by checking for a protected route
  const currentUrl = page.url();
  if (currentUrl.includes('/auth/login')) {
    throw new Error('Login failed - still on login page. Please check credentials.');
  }
}
