import { useState } from 'react';
import { useFlashcards } from '@/components/hooks/useFlashcards';
import { useFlashcardModal } from '@/components/hooks/useFlashcardModal';
import { FilterBar } from './FilterBar';
import { FlashcardsTable } from './FlashcardsTable';
import { FlashcardModal } from './FlashcardModal';
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
      if (!modalState.flashcard?.id) {
        throw new Error('No flashcard ID provided');
      }
      console.log(JSON.stringify(data));
      const response = await fetch(`/api/flashcards/${modalState.flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 404) {
          throw new Error('Flashcard not found');
        } else if (response.status === 400 && errorData.errors) {
          throw new Error('Invalid flashcard data: ' + errorData.errors.map((e: any) => e.message).join(', '));
        } else {
          throw new Error(errorData.message || 'Failed to update flashcard');
        }
      }

      const updatedFlashcard = await response.json();
      toast.success('Flashcard updated successfully');
      refresh();
      return updatedFlashcard;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flashcard');
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleDelete = async (flashcard: FlashcardViewModel) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete flashcard');
      }

      toast.success('Flashcard deleted successfully');
      refresh();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error('Failed to delete flashcard');
    }
  };

  const { modalState, openEdit, close } = useFlashcardModal(handleSave);

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
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-4">
        <FilterBar onSourceFilterChange={setSourceFilter} />
        
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
    </div>
  );
}
