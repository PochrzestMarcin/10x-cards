import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { FlashcardModalComponent } from './components/FlashcardModalComponent';

export class FlashcardsViewPage extends BasePage {
  readonly flashcardModal: FlashcardModalComponent;

  constructor(page: Page) {
    super(page);
    this.flashcardModal = new FlashcardModalComponent(page);
  }

  // Locators
  private get container() {
    return this.page.locator('[data-test-id="flashcards-view"]');
  }

  private get createButton() {
    return this.page.locator('[data-test-id="create-flashcard-button"]');
  }

  // Actions
  async goto() {
    await this.page.goto('/flashcards');
    // Wait for navigation and page load
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(this.container);
  }

  async clickCreateFlashcard() {
    await this.clickElement(this.createButton);
    await this.flashcardModal.waitForOpen();
  }

  // Assertions
  async expectPageToBeVisible() {
    await this.expectToBeVisible(this.container);
    await this.expectToBeVisible(this.createButton);
  }
}
