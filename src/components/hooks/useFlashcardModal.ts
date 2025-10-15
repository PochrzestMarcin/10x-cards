import { useState, useCallback } from 'react';
import type { FlashcardViewModel, FlashcardUpdateDto } from '@/types';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  flashcard: FlashcardViewModel | null;
}

export function useFlashcardModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    flashcard: null
  });

  const openCreate = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'create',
      flashcard: null
    });
  }, []);

  const openEdit = useCallback((flashcard: FlashcardViewModel) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      flashcard
    });
  }, []);

  const close = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const save = useCallback(async (data: FlashcardUpdateDto) => {
    if (modalState.mode === 'edit' && modalState.flashcard) {
      const response = await fetch(`/api/flashcards/${modalState.flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update flashcard');
      }

      return response.json();
    } else {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flashcards: [{
            ...data,
            source: 'manual'
          }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create flashcard');
      }

      return response.json();
    }
  }, [modalState.mode, modalState.flashcard]);

  return {
    modalState,
    openCreate,
    openEdit,
    close,
    save
  };
}
