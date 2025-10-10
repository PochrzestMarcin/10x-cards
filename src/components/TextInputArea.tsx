import { useState, useEffect, type ChangeEvent } from 'react';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextInputArea({ value, onChange, placeholder }: TextInputAreaProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value.length > 0 && value.length < 1000) {
      setError('Text must be at least 1000 characters long');
    } else if (value.length > 10000) {
      setError('Text cannot exceed 10000 characters');
    } else {
      setError(null);
    }
  }, [value]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] max-h-[400px] resize-y"
          />
          <div className="flex justify-between items-center text-sm">
            <span className={error ? 'text-red-500' : 'text-muted-foreground'}>
              {error || `${value.length} characters`}
            </span>
            <span className="text-muted-foreground">
              {value.length >= 1000 && value.length <= 10000 ? '✓' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
