import { Button } from './ui/button';
import { Save, CheckCircle } from 'lucide-react';
import type { FlashcardProposalViewModel } from './FlashcardGenerationView';

interface BulkSaveButtonProps {
  flashcards: FlashcardProposalViewModel[];
  generationId: number | null;
  onSaveAll: () => void;
  onSaveAccepted: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function BulkSaveButton({
  flashcards,
  generationId,
  onSaveAll,
  onSaveAccepted,
  disabled = false,
  isLoading = false
}: BulkSaveButtonProps) {
  const acceptedCount = flashcards.filter(f => f.accepted).length;
  const hasAccepted = acceptedCount > 0;
  const hasFlashcards = flashcards.length > 0;
  
  if (!hasFlashcards || !generationId) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-end">
      <Button
        variant="outline"
        onClick={onSaveAccepted}
        disabled={disabled || isLoading || !hasAccepted}
        className="space-x-2"
      >
        <CheckCircle className="h-4 w-4" />
        <span>Save Accepted ({acceptedCount})</span>
      </Button>
      
      <Button
        onClick={onSaveAll}
        disabled={disabled || isLoading}
        className="space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>Save All ({flashcards.length})</span>
      </Button>
    </div>
  );
}
