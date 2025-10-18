import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { FlashcardViewModel } from "@/types";

interface FlashcardRowProps {
  flashcard: FlashcardViewModel;
  onEdit: (flashcard: FlashcardViewModel) => void;
  onDelete: (flashcard: FlashcardViewModel) => void;
}

export function FlashcardRow({ flashcard, onEdit, onDelete }: FlashcardRowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "ai-full":
        return "AI Generated";
      case "ai-edited":
        return "AI Edited";
      case "manual":
        return "Manual";
      default:
        return source;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium break-words max-w-[250px]">{flashcard.front}</TableCell>
      <TableCell className="break-words max-w-[300px]">{flashcard.back}</TableCell>
      <TableCell className="whitespace-nowrap">{getSourceLabel(flashcard.source)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(flashcard.created_at)}</TableCell>
      <TableCell className="text-left">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(flashcard)} className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit flashcard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(flashcard)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete flashcard</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
