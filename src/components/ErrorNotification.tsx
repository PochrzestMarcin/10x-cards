import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorNotificationProps {
  message: string;
}

export function ErrorNotification({ message }: ErrorNotificationProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
