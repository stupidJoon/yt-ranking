import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'yt-ranking',
  description: 'Youtube Trends • Hype Videos Ranking',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌠</text></svg>',
  },
  verification: {
    google: "rxqyEF7PImxt9bTERFRI40rt30rjcKfTulDaIMqANZ4",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
