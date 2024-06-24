import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Web3Provider } from '@/providers/web3Provider';

export const metadata: Metadata = {
  title: 'Dabl DevCamp',
  description: 'Become a dApp developer in 2 weeks',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Web3Provider>{children}</Web3Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
