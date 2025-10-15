import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import type { FlashcardViewModel, PaginationDto } from '@/types';
import { ChevronLeft, ChevronRight, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

interface FlashcardsTableProps {
  flashcards: FlashcardViewModel[];
  pagination: PaginationDto;
  isLoading: boolean;
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (flashcard: FlashcardViewModel) => void;
  onDelete: (flashcard: FlashcardViewModel) => void;
}

export default function FlashcardsTable({
  flashcards,
  pagination,
  isLoading,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
}: FlashcardsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handleSort = (column: string) => {
    setSortColumn(column);
    onSort(column);
    toast.success(`Sorted by ${column}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: pagination.limit }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('created_at')}
          className={`text-sm ${sortColumn === 'created_at' ? 'bg-accent' : ''}`}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('source')}
          className={`text-sm ${sortColumn === 'source' ? 'bg-accent' : ''}`}
        >
          Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {flashcards.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg text-muted-foreground">
            You haven't created any flashcards yet
          </p>
          <p className="text-sm text-muted-foreground">
            Click the "Create Flashcard" button above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flashcards.map((flashcard) => (
            <Card 
              key={flashcard.id} 
              className={`p-4 transition-colors ${hoveredCard === flashcard.id ? 'bg-accent/5' : ''}`}
              onMouseEnter={() => setHoveredCard(flashcard.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <p className="font-medium">{flashcard.front}</p>
                  <p className="text-muted-foreground">{flashcard.back}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(flashcard.created_at).toLocaleDateString()} · {flashcard.source}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onEdit(flashcard);
                      toast.info('Editing flashcard');
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDelete(flashcard);
                      toast.info('Confirm deletion');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPageChange(pagination.page - 1);
              toast.success(`Navigated to page ${pagination.page - 1}`);
            }}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPageChange(pagination.page + 1);
              toast.success(`Navigated to page ${pagination.page + 1}`);
            }}
            disabled={pagination.page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
