import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Check, X, Edit2, Save } from 'lucide-react';
import type { FlashcardProposalViewModel } from './FlashcardGenerationView';

interface FlashcardListItemProps {
  flashcard: FlashcardProposalViewModel;
  onAccept: () => void;
  onEdit: (front: string, back: string) => void;
  onReject: () => void;
}

export function FlashcardListItem({
  flashcard,
  onAccept,
  onEdit,
  onReject,
}: FlashcardListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState(flashcard.front);
  const [editedBack, setEditedBack] = useState(flashcard.back);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  const validateEdit = () => {
    let isValid = true;
    
    if (editedFront.length > 200) {
      setFrontError('Front text cannot exceed 200 characters');
      isValid = false;
    } else {
      setFrontError(null);
    }

    if (editedBack.length > 500) {
      setBackError('Back text cannot exceed 500 characters');
      isValid = false;
    } else {
      setBackError(null);
    }

    return isValid;
  };

  const handleSaveEdit = () => {
    if (validateEdit()) {
      onEdit(editedFront, editedBack);
      setIsEditing(false);
    }
  };

  const cardStyle = flashcard.accepted ? 'border-green-500' : '';

  return (
    <Card className={`overflow-hidden ${cardStyle}`}>
      <CardContent className="p-6">
        <div className="space-y-4 h-full">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Textarea
                  value={editedFront}
                  onChange={(e) => setEditedFront(e.target.value)}
                  placeholder="Front side"
                  className="resize-none"
                />
                <div className="flex justify-between items-center text-xs">
                  {frontError ? (
                    <p className="text-red-500">{frontError}</p>
                  ) : (
                    <span className="text-muted-foreground">Front side</span>
                  )}
                  <span className={`${editedFront.length > 200 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {editedFront.length}/200
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  value={editedBack}
                  onChange={(e) => setEditedBack(e.target.value)}
                  placeholder="Back side"
                  className="resize-none"
                />
                <div className="flex justify-between items-center text-xs">
                  {backError ? (
                    <p className="text-red-500">{backError}</p>
                  ) : (
                    <span className="text-muted-foreground">Back side</span>
                  )}
                  <span className={`${editedBack.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {editedBack.length}/500
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="font-medium">{flashcard.front}</p>
              <p className="text-muted-foreground">{flashcard.back}</p>
            </>
          )}

          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <Button
                variant="outline"
                onClick={handleSaveEdit}
                className="space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onAccept}
                  disabled={flashcard.accepted}
                  className="space-x-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Accept</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="space-x-1"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onReject}
                  className="space-x-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
