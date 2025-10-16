import { useState } from 'react';
import { toast } from 'sonner';
import type { FlashcardProposalDto } from '../../types.ts';
import { TextInputArea } from '../TextInputArea.tsx';
import { GenerateButton } from './GenerateButton.tsx';
import { SkeletonLoader } from '../SkeletonLoader.tsx';
import { FlashcardList } from './FlashcardList.tsx';
import { BulkSaveButton } from '../BulkSaveButton.tsx';
import { useGenerateFlashcards } from '../hooks/useGenerateFlashcards.ts';

export interface FlashcardProposalViewModel extends Omit<FlashcardProposalDto, 'source'> {
  accepted: boolean;
  edited: boolean;
  source: "ai-full" | "ai-edited";
}

export function FlashcardGenerationView() {
  const [textValue, setTextValue] = useState('');
  const {
    flashcardProposals,
    setFlashcardProposals,
    generationId,
    isLoading,
    generateFlashcards,
    saveFlashcards,
  } = useGenerateFlashcards();

  const handleTextChange = (value: string) => {
    setTextValue(value);
  };

  const handleGenerateClick = () => {
    generateFlashcards(textValue);
  };

  const handleAccept = (index: number) => {
    const updatedProposals = [...flashcardProposals];
    updatedProposals[index] = {
      ...updatedProposals[index],
      accepted: true,
    };
    setFlashcardProposals(updatedProposals);
  };

  const handleEdit = (index: number, front: string, back: string) => {
    const updatedProposals = [...flashcardProposals];
    updatedProposals[index] = {
      ...updatedProposals[index],
      front,
      back,
      edited: true,
    };
    setFlashcardProposals(updatedProposals);
  };

  const handleReject = (index: number) => {
    const updatedProposals = flashcardProposals.filter((_, i) => i !== index);
    setFlashcardProposals(updatedProposals);
  };

  const handleSaveAll = () => {
    toast.promise(saveFlashcards(flashcardProposals), {
      loading: 'Saving all flashcards...',
      success: `Successfully saved ${flashcardProposals.length} flashcards`,
      error: 'Failed to save flashcards'
    });
  };

  const handleSaveAccepted = () => {
    const acceptedFlashcards = flashcardProposals.filter(card => card.accepted);
    toast.promise(saveFlashcards(acceptedFlashcards), {
      loading: 'Saving accepted flashcards...',
      success: `Successfully saved ${acceptedFlashcards.length} flashcards`,
      error: 'Failed to save flashcards'
    });
  };

  const isValidText = textValue.length >= 1000 && textValue.length <= 10000;

  return (
    <div className="space-y-2">
      <TextInputArea
        value={textValue}
        onChange={handleTextChange}
        placeholder="Paste your text here (1000-10000 characters)"
      />

      <GenerateButton
        onClick={handleGenerateClick}
        disabled={!isValidText}
        isLoading={isLoading}
      />

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        flashcardProposals.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <BulkSaveButton
                flashcards={flashcardProposals}
                generationId={generationId}
                onSaveAll={handleSaveAll}
                onSaveAccepted={handleSaveAccepted}
                disabled={isLoading}
              />
            </div>
            <FlashcardList
              flashcards={flashcardProposals}
              onAccept={handleAccept}
              onEdit={handleEdit}
              onReject={handleReject}
            />
          </div>
        )
      )}
    </div>
  );
}
