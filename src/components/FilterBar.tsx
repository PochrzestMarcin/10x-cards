import { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { FlashcardSource } from '@/types';

interface FilterBarProps {
  selectedSource: FlashcardSource | null;
  onSourceChange: (source: FlashcardSource | null) => void;
  onCreateClick: () => void;
}

const sourceOptions: { value: FlashcardSource; label: string }[] = [
  { value: 'ai-full', label: 'AI Generated' },
  { value: 'ai-edited', label: 'AI Edited' },
  { value: 'manual', label: 'Manual' },
];

export default function FilterBar({
  selectedSource,
  onSourceChange,
  onCreateClick,
}: FilterBarProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSourceChange = (value: string) => {
    onSourceChange(value as FlashcardSource || null);
    setIsSelectOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="source-filter" className="text-sm font-medium">
          Filter by source:
        </label>
        <Select
          value={selectedSource || ''}
          onValueChange={handleSourceChange}
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger id="source-filter" className="w-[180px]">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All sources</SelectItem>
            {sourceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onCreateClick}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        className={`transition-colors ${isButtonHovered ? 'bg-primary/90' : ''}`}
      >
        Create Flashcard
      </Button>
    </div>
  );
}
