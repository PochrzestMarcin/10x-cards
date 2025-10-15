import { useState, useCallback } from 'react';
import type { FlashcardViewModel } from '@/types';
import { toast } from 'sonner';

interface DeleteDialogState {
  isOpen: boolean;
  flashcard: FlashcardViewModel | null;
}

export function useFlashcardActions() {
  const [deleteState, setDeleteState] = useState<DeleteDialogState>({
    isOpen: false,
    flashcard: null
  });

  const openDelete = useCallback((flashcard: FlashcardViewModel) => {
    setDeleteState({
      isOpen: true,
      flashcard
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteState.flashcard) {
      return;
    }

    try {
      const response = await fetch(`/api/flashcards/${deleteState.flashcard.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete flashcard');
      }

      toast.success('Flashcard deleted successfully');
      setDeleteState({ isOpen: false, flashcard: null });
      return response.json();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete flashcard');
      throw error;
    }
  }, [deleteState.flashcard]);

  const cancelDelete = useCallback(() => {
    setDeleteState({
      isOpen: false,
      flashcard: null
    });
  }, []);

  return {
    deleteState,
    openDelete,
    confirmDelete,
    cancelDelete
  };
}
