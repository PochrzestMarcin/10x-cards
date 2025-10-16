import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import type {
  GenerateFlashcardsCommand,
  GenerationCreateResponseDto,
  FlashcardCreateDto,
  CreateFlashcardCommand,
  CreateFlashcardsResponseDto,
} from '../../types';
import type { FlashcardProposalViewModel } from '../generate/FlashcardGenerationView';

interface UseGenerateFlashcardsResult {
  flashcardProposals: FlashcardProposalViewModel[];
  setFlashcardProposals: Dispatch<SetStateAction<FlashcardProposalViewModel[]>>;
  generationId: number | null;
  isLoading: boolean;
  generateFlashcards: (text: string) => Promise<void>;
  saveFlashcards: (flashcardsToSave: FlashcardProposalViewModel[]) => Promise<void>;
}

export function useGenerateFlashcards(): UseGenerateFlashcardsResult {
  const [flashcardProposals, setFlashcardProposals] = useState<FlashcardProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateFlashcards = async (text: string) => {
    try {
      setIsLoading(true);
      toast.dismiss();

      const command: GenerateFlashcardsCommand = {
        source_text: text
      };

      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate flashcards');
      }

      const data: GenerationCreateResponseDto = await response.json();
      setGenerationId(data.generationId);
      setFlashcardProposals(
        data.draft_flashcards.map(card => ({
          ...card,
          accepted: false,
          edited: false,
        }))
      );
      toast.success(`Successfully generated ${data.generated_count} flashcards`, {
        description: 'Review and edit the flashcards before saving them.',
        duration: 5000
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async (flashcardsToSave: FlashcardProposalViewModel[]) => {
    if (!generationId) {
      toast.error('No generation ID available');
      return;
    }

    try {
      setIsLoading(true);
      toast.dismiss();

      const flashcardsToCreate: FlashcardCreateDto[] = flashcardsToSave.map(card => ({
        front: card.front,
        back: card.back,
        source: card.edited ? 'ai-edited' : 'ai-full',
        generation_id: generationId
      }));

      const command: CreateFlashcardCommand = {
        flashcards: flashcardsToCreate
      };

      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save flashcards');
      }

      const data: CreateFlashcardsResponseDto = await response.json();
      // Clear the proposals after successful save
      setFlashcardProposals([]);
      setGenerationId(null);
      toast.success(`Successfully saved ${data.flashcards.length} flashcards`, {
        description: 'Your flashcards have been saved to your collection.',
        duration: 5000
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    flashcardProposals,
    setFlashcardProposals,
    generationId,
    isLoading,
    generateFlashcards,
    saveFlashcards,
  };
}
