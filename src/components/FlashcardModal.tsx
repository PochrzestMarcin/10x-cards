import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import type { FlashcardViewModel, FlashcardUpdateDto } from '@/types';

interface FlashcardModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  flashcard: FlashcardViewModel | null;
  onSave: (flashcard: FlashcardUpdateDto) => Promise<void>;
  onClose: () => void;
}

interface FormState {
  front: string;
  back: string;
  errors: {
    front?: string;
    back?: string;
  };
}

export default function FlashcardModal({
  isOpen,
  mode,
  flashcard,
  onSave,
  onClose,
}: FlashcardModalProps) {
  const [formState, setFormState] = useState<FormState>({
    front: flashcard?.front || '',
    back: flashcard?.back || '',
    errors: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormState['errors'] = {};

    if (!formState.front.trim()) {
      errors.front = 'Front side is required';
    } else if (formState.front.length > 200) {
      errors.front = 'Front side must be 200 characters or less';
    }

    if (!formState.back.trim()) {
      errors.back = 'Back side is required';
    } else if (formState.back.length > 500) {
      errors.back = 'Back side must be 500 characters or less';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        front: formState.front.trim(),
        back: formState.back.trim(),
      });
      toast.success(
        mode === 'create'
          ? 'Flashcard created successfully'
          : 'Flashcard updated successfully'
      );
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save flashcard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Flashcard' : 'Edit Flashcard'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="front"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Front
            </label>
            <Input
              id="front"
              value={formState.front}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  front: e.target.value,
                  errors: { ...prev.errors, front: undefined },
                }))
              }
              placeholder="Enter the front side text"
              className={formState.errors.front ? 'border-red-500' : ''}
            />
            {formState.errors.front && (
              <p className="text-sm text-red-500">{formState.errors.front}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formState.front.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="back"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Back
            </label>
            <Textarea
              id="back"
              value={formState.back}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  back: e.target.value,
                  errors: { ...prev.errors, back: undefined },
                }))
              }
              placeholder="Enter the back side text"
              className={formState.errors.back ? 'border-red-500' : ''}
            />
            {formState.errors.back && (
              <p className="text-sm text-red-500">{formState.errors.back}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formState.back.length}/500 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
