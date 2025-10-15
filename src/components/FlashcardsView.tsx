import { useState } from 'react';
import { toast } from 'sonner';
import type { FlashcardUpdateDto } from '@/types';
import { useFlashcards } from './hooks/useFlashcards';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    flashcards,
    pagination,
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
    setIsLoading(true);
    try {
      await saveFlashcard(data);
      closeModal();
      await refresh();
      toast.success('Flashcard saved successfully');
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to save flashcard: ${error.message}`);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await confirmDelete();
      await refresh();
      toast.success('Flashcard deleted successfully');
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to delete flashcard: ${error.message}`);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button
          onClick={() => {
            setError(null);
            refresh();
          }}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {flashcards.length > 0 && (
            <FilterBar
              selectedSource={sourceFilter}
              onSourceChange={setSourceFilter}
              onCreateClick={openCreate}
            />
          )}
        </div>
        {flashcards.length === 0 && (
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Flashcard
          </button>
        )}
      </div>
      
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
