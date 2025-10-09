import type { FlashcardProposalDto } from '../../types';

export interface AIService {
  generateFlashcards(sourceText: string): Promise<FlashcardProposalDto[]>;
}

export class AIService implements AIService {
  async generateFlashcards(sourceText: string): Promise<FlashcardProposalDto[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        front: "What is the capital of France?",
        back: "Paris",
        source: "ai-full"
      },
      {
        front: "Who wrote Romeo and Juliet?",
        back: "William Shakespeare",
        source: "ai-full"
      },
      {
        front: "What is the largest planet in our solar system?",
        back: "Jupiter",
        source: "ai-full"
      }
    ];
  }
}