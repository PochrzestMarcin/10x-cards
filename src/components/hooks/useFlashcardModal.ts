import { useState } from 'react';
import type { FlashcardViewModel, ModalState, FlashcardUpdateDto } from '@/types';

export interface UseFlashcardModalReturn {
  modalState: ModalState;
  openCreate: () => void;
  openEdit: (flashcard: FlashcardViewModel) => void;
  close: () => void;
  save: (data: FlashcardUpdateDto) => Promise<void>;
}

export function useFlashcardModal(
  onSave: (data: FlashcardUpdateDto) => Promise<void>
): UseFlashcardModalReturn {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    flashcard: null,
  });

  const openCreate = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      flashcard: null,
    });
  };

  const openEdit = (flashcard: FlashcardViewModel) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      flashcard,
    });
  };

  const close = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const save = async (data: FlashcardUpdateDto) => {
    await onSave(data);
    close();
  };

  return {
    modalState,
    openCreate,
    openEdit,
    close,
    save,
  };
}
