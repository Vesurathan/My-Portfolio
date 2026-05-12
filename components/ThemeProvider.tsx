'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      value={{ light: 'light', dark: 'dark' }}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

