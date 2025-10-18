import { useEffect } from "react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../lib/stores/auth.store";
import { toast } from "sonner";

interface UserMenuProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

export function UserMenu({ isAuthenticated, userEmail }: UserMenuProps) {
  const { setUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setUser(null);
      toast.success("Successfully signed out");
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

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
      {userEmail && <span className="text-sm text-muted-foreground">{userEmail}</span>}
      <Button variant="ghost" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
