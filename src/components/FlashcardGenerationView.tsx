import { useState } from 'react';
import type { FlashcardProposalDto } from '../types';
import { TextInputArea } from './TextInputArea.tsx';
import { GenerateButton } from './GenerateButton.tsx';
import { SkeletonLoader } from './SkeletonLoader.tsx';
import { ErrorNotification } from './ErrorNotification.tsx';
import { FlashcardList } from './FlashcardList.tsx';
import { BulkSaveButton } from './BulkSaveButton.tsx';
import { useGenerateFlashcards } from './hooks/useGenerateFlashcards';

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
    errorMessage,
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
    saveFlashcards(flashcardProposals);
  };

  const handleSaveAccepted = () => {
    const acceptedFlashcards = flashcardProposals.filter(card => card.accepted);
    saveFlashcards(acceptedFlashcards);
  };

  const isValidText = textValue.length >= 1000 && textValue.length <= 10000;

  return (
    <div className="space-y-6">
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

      {errorMessage && (
        <ErrorNotification message={errorMessage} />
      )}

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        flashcardProposals.length > 0 && (
          <div className="space-y-4">
            <FlashcardList
              flashcards={flashcardProposals}
              onAccept={handleAccept}
              onEdit={handleEdit}
              onReject={handleReject}
            />
            <BulkSaveButton
              flashcards={flashcardProposals}
              generationId={generationId}
              onSaveAll={handleSaveAll}
              onSaveAccepted={handleSaveAccepted}
              disabled={isLoading}
            />
          </div>
        )
      )}
    </div>
  );
}
