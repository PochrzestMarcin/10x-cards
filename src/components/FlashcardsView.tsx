import { useFlashcards } from './hooks/useFlashcards';
import type { FlashcardUpdateDto } from '@/types';
import { useFlashcardModal } from './hooks/useFlashcardModal';
import { useFlashcardActions } from './hooks/useFlashcardActions';
import {
  FilterBar,
  FlashcardsTable,
  FlashcardModal,
  DeleteConfirmationDialog
} from '.';
import { Toaster } from './ui/sonner';

export function FlashcardsView() {
  const {
    flashcards,
    pagination,
    isLoading,
    error,
    setPage,
    setSort,
    setSourceFilter,
    sourceFilter,
    refresh
  } = useFlashcards();

  const {
    modalState,
    openCreate,
    openEdit,
    close: closeModal,
    save: saveFlashcard
  } = useFlashcardModal();

  const {
    deleteState,
    openDelete,
    confirmDelete,
    cancelDelete
  } = useFlashcardActions();

  const handleSave = async (data: FlashcardUpdateDto) => {
    try {
      await saveFlashcard(data);
      closeModal();
      refresh();
    } catch (error) {
      // Error handling is done in the modal component
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await confirmDelete();
      refresh();
    } catch (error) {
      // Error is handled in useFlashcardActions
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button
          onClick={refresh}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar
        selectedSource={sourceFilter}
        onSourceChange={setSourceFilter}
        onCreateClick={openCreate}
      />
      
      <FlashcardsTable
        flashcards={flashcards}
        pagination={pagination}
        isLoading={isLoading}
        onSort={setSort}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <FlashcardModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        flashcard={modalState.flashcard}
        onSave={handleSave}
        onClose={closeModal}
      />

      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        flashcard={deleteState.flashcard}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      <Toaster />
    </div>
  );
}
