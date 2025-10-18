import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const E2E_USERNAME = process.env.E2E_USERNAME as string;
const E2E_PASSWORD = process.env.E2E_PASSWORD as string;

export async function loginAsTestUser(page: Page) {
  console.log('Starting login process...');
  
  // Navigate to login page
  await page.goto('/auth/login');

  // Wait for and fill email input
  const emailInput = page.locator('input[data-test-id="auth-input-email"]');
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.click();
  await emailInput.fill(E2E_USERNAME);
  await expect(emailInput).toHaveValue(E2E_USERNAME);

  // Wait for and fill password input
  const passwordInput = page.locator('input[data-test-id="auth-input-password"]');
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.click();
  await passwordInput.fill(E2E_PASSWORD);
  await expect(passwordInput).toHaveValue(E2E_PASSWORD);

  // Wait for and click submit button
  const submitButton = page.locator('button[data-test-id="sign-in-button"]');
  await submitButton.waitFor({ state: 'visible' });
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), submitButton.click()]);
}
