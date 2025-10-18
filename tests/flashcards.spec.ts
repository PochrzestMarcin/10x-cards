import { test, expect } from '@playwright/test';
import { FlashcardsViewPage } from './pages/FlashcardsViewPage';

test.describe('Flashcards Management', () => {
  let flashcardsPage: FlashcardsViewPage;

  test.beforeEach(async ({ page }) => {
    flashcardsPage = new FlashcardsViewPage(page);
    await flashcardsPage.goto();
  });

  test('should create a new flashcard', async () => {
    // Arrange
    const flashcardData = {
      front: 'What is the capital of France?',
      back: 'Paris'
    };

    // Act
    await flashcardsPage.clickCreateFlashcard();
    await flashcardsPage.flashcardModal.createFlashcard(flashcardData);

    // Assert
    await flashcardsPage.flashcardModal.expectModalToBeClosed();
    // Add more assertions here as needed (e.g., check if the flashcard appears in the table)
  });
});
