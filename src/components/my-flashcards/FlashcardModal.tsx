import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flashcardUpdateSchema, type FlashcardUpdate } from "@/lib/schemas/flashcard.schema";
import type { FlashcardViewModel, FlashcardUpdateDto } from "@/types";

interface FlashcardModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  flashcard: FlashcardViewModel | null;
  onSave: (flashcard: FlashcardUpdateDto) => Promise<void>;
  onClose: () => void;
}

export function FlashcardModal({ isOpen, mode, flashcard, onSave, onClose }: FlashcardModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FlashcardUpdate>({
    resolver: zodResolver(flashcardUpdateSchema),
    defaultValues: {
      front: "",
      back: "",
      source: "manual",
    },
  });

  useEffect(() => {
    if (flashcard && mode === "edit") {
      // Only allow manual or ai-edited for updates
      const source = (flashcard.source === "ai-full" ? "ai-edited" : flashcard.source) as "manual" | "ai-edited";
      reset({
        front: flashcard.front,
        back: flashcard.back,
        source,
      });
    }
  }, [flashcard, mode, reset]);

  const onSubmit = async (data: FlashcardUpdateDto) => {
    await onSave(data);
    reset({
      front: "",
      back: "",
      source: "manual",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Flashcard" : "Edit Flashcard"}</DialogTitle>
        </DialogHeader>
        <form data-test-id="flashcard-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              data-test-id="flashcard-front-input"
              {...register("front")}
              placeholder="Front side"
              className={errors.front ? "border-red-500" : ""}
            />
            {errors.front && <p className="text-sm text-red-500">{errors.front.message}</p>}
          </div>
          <div className="space-y-2">
            <Textarea
              data-test-id="flashcard-back-input"
              {...register("back")}
              placeholder="Back side"
              className={errors.back ? "border-red-500" : ""}
            />
            {errors.back && <p className="text-sm text-red-500">{errors.back.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button data-test-id="save-flashcard-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
