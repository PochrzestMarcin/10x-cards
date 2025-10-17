import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FlashcardSource } from '@/types';

interface FilterBarProps {
  onSourceFilterChange: (source: FlashcardSource | null) => void;
}

export function FilterBar({ onSourceFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
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
  );
}
