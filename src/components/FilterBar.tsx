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
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="source-filter" className="text-sm font-medium">
          Filter by source:
        </label>
        <Select
          value={selectedSource || ''}
          onValueChange={(value: string) => onSourceChange(value as FlashcardSource || null)}
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

      <Button onClick={onCreateClick}>
        Create Flashcard
      </Button>
    </div>
  );
}
