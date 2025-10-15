import { useState, useEffect, useCallback } from 'react';
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
  isDirty: boolean;
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
    isDirty: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormState({
        front: flashcard?.front || '',
        back: flashcard?.back || '',
        errors: {},
        isDirty: false,
      });
    }
  }, [isOpen, flashcard]);

  const validateForm = useCallback((): boolean => {
    const errors: FormState['errors'] = {};
    const frontTrimmed = formState.front.trim();
    const backTrimmed = formState.back.trim();

    if (!frontTrimmed) {
      errors.front = 'Front side is required';
    } else if (frontTrimmed.length > 200) {
      errors.front = 'Front side must be 200 characters or less';
    } else if (frontTrimmed.length < 3) {
      errors.front = 'Front side must be at least 3 characters';
    }

    if (!backTrimmed) {
      errors.back = 'Back side is required';
    } else if (backTrimmed.length > 500) {
      errors.back = 'Back side must be 500 characters or less';
    } else if (backTrimmed.length < 3) {
      errors.back = 'Back side must be at least 3 characters';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [formState.front, formState.back]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    if (!formState.isDirty) {
      toast.info('No changes to save');
      onClose();
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to save flashcard';
      toast.error(errorMessage);
      setFormState(prev => ({
        ...prev,
        errors: { front: errorMessage, back: errorMessage },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: 'front' | 'back',
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
        isDirty: true,
        errors: { ...prev.errors, [field]: undefined },
      }));
    } else {
      toast.error(`${field} side cannot exceed ${maxLength} characters`);
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
              onChange={(e) => handleInputChange('front', e.target.value, 200)}
              onBlur={() => validateForm()}
              placeholder="Enter the front side text"
              className={`transition-colors ${
                formState.errors.front ? 'border-red-500' : ''
              } ${isHovered ? 'border-primary' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isSubmitting}
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
              onChange={(e) => handleInputChange('back', e.target.value, 500)}
              onBlur={() => validateForm()}
              placeholder="Enter the back side text"
              className={`transition-colors ${
                formState.errors.back ? 'border-red-500' : ''
              } ${isHovered ? 'border-primary' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isSubmitting}
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
              onClick={() => {
                if (formState.isDirty) {
                  toast.info('Discarding changes');
                }
                onClose();
              }}
              disabled={isSubmitting}
              className="transition-colors hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formState.isDirty}
              className="transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
