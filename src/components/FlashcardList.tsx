import type { FlashcardProposalViewModel } from './FlashcardGenerationView';
import { FlashcardListItem } from './FlashcardListItem';

interface FlashcardListProps {
  flashcards: FlashcardProposalViewModel[];
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onReject: (index: number) => void;
}

export function FlashcardList({ flashcards, onAccept, onEdit, onReject }: FlashcardListProps) {
  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard, index) => (
        <FlashcardListItem
          key={index}
          flashcard={flashcard}
          onAccept={() => onAccept(index)}
          onEdit={(front, back) => onEdit(index, front, back)}
          onReject={() => onReject(index)}
        />
      ))}
    </div>
  );
}
