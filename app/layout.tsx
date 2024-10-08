import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import ThemeApplier from '@/components/ThemeApplier';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Togtider - Revamp',
  description: 'Generated by create next app',
  manifest: './manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning>
      <head>
        <Script
          src="https://kit.fontawesome.com/e4cef1fffb.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
        <ThemeApplier />
      </body>
    </html>
  );
}
