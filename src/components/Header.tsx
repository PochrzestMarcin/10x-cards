import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from './auth/UserMenu';

interface HeaderProps {
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function Header({ isAuthenticated = false, userEmail }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">10x Cards</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <UserMenu isAuthenticated={isAuthenticated} userEmail={userEmail} />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
