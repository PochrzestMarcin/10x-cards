import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { FlashcardModal } from '../FlashcardModal';
import type { FlashcardViewModel } from '@/types';

describe('FlashcardModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();
  
  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnClose.mockClear();
  });

  const mockFlashcard: FlashcardViewModel = {
    id: 1,
    front: 'Test Front',
    back: 'Test Back',
    source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isEditing: false,
    generation_id: null
  };

  describe('Create Mode', () => {
    it('renders create modal with empty form', () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Create Flashcard')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Front side')).toHaveValue('');
      expect(screen.getByPlaceholderText('Back side')).toHaveValue('');
    });

    it('validates required fields', async () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText('String must contain at least 1 character(s)');
        expect(errorMessages).toHaveLength(2); // One for front and one for back
      });
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('submits valid form data', async () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      await userEvent.type(screen.getByPlaceholderText('Front side'), 'New Front');
      await userEvent.type(screen.getByPlaceholderText('Back side'), 'New Back');
      
      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          front: 'New Front',
          back: 'New Back',
          source: 'manual'
        });
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('renders edit modal with populated form', () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="edit"
          flashcard={mockFlashcard}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Edit Flashcard')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Front side')).toHaveValue('Test Front');
      expect(screen.getByPlaceholderText('Back side')).toHaveValue('Test Back');
    });

    it('handles ai-full source conversion to ai-edited', async () => {
      const aiFlashcard = { ...mockFlashcard, source: 'ai-full' as const };
      render(
        <FlashcardModal
          isOpen={true}
          mode="edit"
          flashcard={aiFlashcard}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      // Submit without changes to verify source conversion
      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          front: 'Test Front',
          back: 'Test Back',
          source: 'ai-edited'
        });
      });
    });

    it('updates existing flashcard', async () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="edit"
          flashcard={mockFlashcard}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const frontInput = screen.getByPlaceholderText('Front side');
      await userEvent.clear(frontInput);
      await userEvent.type(frontInput, 'Updated Front');

      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          front: 'Updated Front',
          back: 'Test Back',
          source: 'manual'
        });
      });
    });
  });

  describe('Modal Behavior', () => {
    it('calls onClose when Cancel button is clicked', async () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows loading state during submission', async () => {
      mockOnSave.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      await userEvent.type(screen.getByPlaceholderText('Front side'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('Back side'), 'Test');
      
      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
      });
    });

    it('resets form after successful submission', async () => {
      render(
        <FlashcardModal
          isOpen={true}
          mode="create"
          flashcard={null}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      await userEvent.type(screen.getByPlaceholderText('Front side'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('Back side'), 'Test');
      
      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Front side')).toHaveValue('');
        expect(screen.getByPlaceholderText('Back side')).toHaveValue('');
      });
    });
  });
});
