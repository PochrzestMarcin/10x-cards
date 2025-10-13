import { Button } from '../ui/button';

interface UserMenuProps {
  isAuthenticated: boolean;
}

export function UserMenu({ isAuthenticated }: UserMenuProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <a href="/auth/login">
          <Button variant="ghost">Sign in</Button>
        </a>
        <a href="/auth/register">
          <Button>Sign up</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={() => {
        // Note: Logout logic will be implemented in next steps
        console.log('Logout clicked');
      }}>
        Sign out
      </Button>
    </div>
  );
}
