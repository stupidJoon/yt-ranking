import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';


export const metadata: Metadata = {
  title: 'yt-ranking',
  description: '유튜브 hype 동영상 랭킹 보기',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌠</text></svg>',
  },
  verification: {
    google: "rxqyEF7PImxt9bTERFRI40rt30rjcKfTulDaIMqANZ4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
