import type { Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export interface FlashcardData {
  front: string;
  back: string;
}

export class FlashcardModalComponent extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private get form() {
    return this.page.locator('[data-test-id="flashcard-form"]');
  }

  private get frontInput() {
    return this.page.locator('[data-test-id="flashcard-front-input"]');
  }

  private get backInput() {
    return this.page.locator('[data-test-id="flashcard-back-input"]');
  }

  private get saveButton() {
    return this.page.locator('[data-test-id="save-flashcard-button"]');
  }

  // Actions
  async waitForOpen() {
    await this.waitForElement(this.form);
  }

  async fillFlashcardForm(data: FlashcardData) {
    await this.fillInput(this.frontInput, data.front);
    await this.fillInput(this.backInput, data.back);
  }

  async saveFlashcard() {
    await this.clickElement(this.saveButton);
    // Wait for the modal to close
    await this.expectToBeHidden(this.form);
  }

  async createFlashcard(data: FlashcardData) {
    await this.waitForOpen();
    await this.fillFlashcardForm(data);
    await this.saveFlashcard();
  }

  // Assertions
  async expectModalToBeVisible() {
    await this.expectToBeVisible(this.form);
    await this.expectToBeVisible(this.frontInput);
    await this.expectToBeVisible(this.backInput);
    await this.expectToBeVisible(this.saveButton);
  }

  async expectModalToBeClosed() {
    await this.expectToBeHidden(this.form);
  }
}
