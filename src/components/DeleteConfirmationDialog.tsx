import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import type { FlashcardViewModel } from '@/types';
import { toast } from 'sonner';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  flashcard: FlashcardViewModel | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  isOpen,
  flashcard,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  const handleConfirm = async () => {
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before confirming deletion`);
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success('Flashcard deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete flashcard';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      toast.info('Deletion cancelled');
      onCancel();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete this flashcard? This action cannot be
              undone.
            </p>
            {flashcard && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Front: {flashcard.front}</p>
                <p className="text-muted-foreground">Back: {flashcard.back}</p>
              </div>
            )}
            {countdown > 0 && (
              <p className="text-sm text-muted-foreground">
                Please wait {countdown} seconds before confirming...
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={handleCancel}
            className="transition-colors hover:bg-secondary"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || countdown > 0}
            className={`transition-colors ${
              countdown > 0 ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'
            } ${isHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isDeleting ? 'Deleting...' : countdown > 0 ? `Wait ${countdown}s` : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
