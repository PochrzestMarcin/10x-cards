import { useState } from 'react';
import { useFlashcards } from '@/components/hooks/useFlashcards';
import { FilterBar } from './FilterBar';
import { FlashcardsTable } from './FlashcardsTable';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { FlashcardViewModel } from '@/types';

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

  const handleEdit = async (flashcard: FlashcardViewModel) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          front: flashcard.front,
          back: flashcard.back,
          source: flashcard.source,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update flashcard');
      }

      refresh();
    } catch (error) {
      console.error('Error updating flashcard:', error);
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

      refresh();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
}
