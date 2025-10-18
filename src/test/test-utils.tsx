import { render as rtlRender } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

interface WrapperProps {
  children: ReactNode;
}

function Providers({ children }: WrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}

function render(ui: ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: Providers,
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
