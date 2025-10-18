import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

const E2E_USERNAME = process.env.E2E_USERNAME as string;
const E2E_PASSWORD = process.env.E2E_PASSWORD as string;

export async function loginAsTestUser(page: Page) {
  console.log("Starting login process...");

  // Navigate to login page
  await page.goto("/auth/login");

  // Wait for and fill email input
  const emailInput = page.locator('input[data-test-id="auth-input-email"]');
  await emailInput.waitFor({ state: "visible" });
  await emailInput.click();
  await emailInput.fill(E2E_USERNAME);
  await expect(emailInput).toHaveValue(E2E_USERNAME);

  // Wait for and fill password input
  const passwordInput = page.locator('input[data-test-id="auth-input-password"]');
  await passwordInput.waitFor({ state: "visible" });
  await passwordInput.click();
  await passwordInput.fill(E2E_PASSWORD);
  await expect(passwordInput).toHaveValue(E2E_PASSWORD);

  // Wait for and click submit button
  const submitButton = page.locator('button[data-test-id="sign-in-button"]');
  await submitButton.waitFor({ state: "visible" });
  await submitButton.click();

  // Wait for navigation to /generate page (successful login)
  await page.waitForURL("**/generate", { timeout: 10000 });

  // Verify we're actually logged in by checking for user-specific content
  // Wait for the page to load completely
  await page.waitForLoadState("networkidle");

  // Additional verification: check that we're on the generate page and not redirected back to login
  const currentUrl = page.url();
  if (currentUrl.includes("/auth/login")) {
    throw new Error("Login failed - redirected back to login page");
  }

  console.log("Login successful - navigated to:", currentUrl);
}
