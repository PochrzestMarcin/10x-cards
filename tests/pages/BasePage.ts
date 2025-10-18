import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  protected async waitForElement(locator: Locator, timeout = 5000) {
    await expect(locator).toBeVisible({ timeout });
  }

  protected async fillInput(locator: Locator, value: string) {
    await locator.fill(value);
  }

  protected async clickElement(locator: Locator) {
    await locator.click();
  }

  protected async expectToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  protected async expectToBeHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }
}
