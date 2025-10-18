import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FlashcardRow } from "./FlashcardRow";
import type { FlashcardViewModel, PaginationDto } from "@/types";

interface FlashcardsTableProps {
  flashcards: FlashcardViewModel[];
  pagination: PaginationDto;
  sort: { column: string; order: "asc" | "desc" };
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (flashcard: FlashcardViewModel) => void;
  onDelete: (flashcard: FlashcardViewModel) => void;
}

export function FlashcardsTable({
  flashcards,
  pagination,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
}: FlashcardsTableProps) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const SortButton = ({ column }: { column: string }) => (
    <Button variant="ghost" size="sm" className="-ml-3" onClick={() => onSort(column)}>
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="w-[30%]">Front</TableCell>
            <TableCell className="w-[50%]">Back</TableCell>
            <TableCell className="w-[10%] whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span>Source</span>
                <SortButton column="source" />
              </div>
            </TableCell>
            <TableCell className="w-[10%] whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span>Created At</span>
                <SortButton column="created_at" />
              </div>
            </TableCell>
            <TableCell className="w-[100px] text-center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flashcards.map((flashcard) => (
            <FlashcardRow key={flashcard.id} flashcard={flashcard} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {flashcards.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-muted-foreground">No flashcards found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
