import { useState } from 'react';
import { useFlashcards } from '@/components/hooks/useFlashcards';
import { useFlashcardModal } from '@/components/hooks/useFlashcardModal';
import { FilterBar } from './FilterBar';
import { FlashcardsTable } from './FlashcardsTable';
import { FlashcardModal } from './FlashcardModal';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { FlashcardViewModel, FlashcardUpdateDto } from '@/types';

export function FlashcardsView() {
  const {
    flashcards,
    pagination,
    isLoading,
    error,
    setPage,
    setSort,
    setSourceFilter,
    refresh,
  } = useFlashcards();

  const [sortState, setSortState] = useState({
    column: 'created_at',
    order: 'desc' as 'asc' | 'desc'
  });

  const handleSort = (column: string) => {
    setSortState(prev => ({
      column,
      order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setSort(column);
  };

  const handleSave = async (data: FlashcardUpdateDto) => {
    try {
      const isCreating = !modalState.flashcard?.id;
      const url = isCreating ? '/api/flashcards' : `/api/flashcards/${modalState.flashcard?.id}`;
      const method = isCreating ? 'POST' : 'PUT';
      const body = isCreating ? JSON.stringify({ flashcards: [data] }) : JSON.stringify(data);
    
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 404) {
          throw new Error('Flashcard not found');
        } else if (response.status === 400 && errorData.errors) {
          throw new Error('Invalid flashcard data: ' + errorData.errors.map((e: any) => e.message).join(', '));
        } else {
          throw new Error(errorData.message || `Failed to ${isCreating ? 'create' : 'update'} flashcard`);
        }
      }

      const result = await response.json();
      const flashcard = isCreating ? result.flashcards[0] : result;
      toast.success(`Flashcard ${isCreating ? 'created' : 'updated'} successfully`);
      refresh();
      return flashcard;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save flashcard');
      throw error; // Re-throw to be handled by the modal
    }
  };

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    flashcard: FlashcardViewModel | null;
  }>({
    isOpen: false,
    flashcard: null,
  });

  const openDeleteDialog = (flashcard: FlashcardViewModel) => {
    setDeleteDialogState({
      isOpen: true,
      flashcard,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogState({
      isOpen: false,
      flashcard: null,
    });
  };

  const handleDelete = async (flashcard: FlashcardViewModel) => {
    openDeleteDialog(flashcard);
  };

  const confirmDelete = async () => {
    if (!deleteDialogState.flashcard) return;

    try {
      const response = await fetch(`/api/flashcards/${deleteDialogState.flashcard.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete flashcard');
      }

      toast.success('Flashcard deleted successfully');
      refresh();
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete flashcard');
    }
  };

  const { modalState, openEdit, openCreate, close } = useFlashcardModal(handleSave);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div data-test-id="flashcards-view" className="container mx-auto py-6 space-y-6">
      <Card className="p-4">
        <FilterBar 
          onSourceFilterChange={setSourceFilter}
          onCreateClick={openCreate}
        />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <FlashcardsTable
            flashcards={flashcards}
            pagination={pagination}
            sort={sortState}
            onSort={handleSort}
            onPageChange={setPage}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <FlashcardModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        flashcard={modalState.flashcard}
        onSave={handleSave}
        onClose={close}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        flashcard={deleteDialogState.flashcard}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
