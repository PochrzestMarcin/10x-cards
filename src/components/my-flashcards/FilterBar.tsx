import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { FlashcardSource } from '@/types';

interface FilterBarProps {
  onSourceFilterChange: (source: FlashcardSource | null) => void;
  onCreateClick: () => void;
}

export function FilterBar({ onSourceFilterChange, onCreateClick }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        <Select 
        onValueChange={(value) => onSourceFilterChange(value === "all" ? null : value as FlashcardSource)}
        defaultValue="all"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          <SelectItem value="ai-full">AI Generated</SelectItem>
          <SelectItem value="ai-edited">AI Edited</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
        </SelectContent>
      </Select>
      </div>
      <Button data-test-id="create-flashcard-button" onClick={onCreateClick} className="ml-auto">
        <Plus className="h-4 w-4 mr-2" />
        Create Flashcard
      </Button>
    </div>
  );
}
