import type { Metadata } from 'next';
import { Noto_Sans_KR, Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '데일리 사주 운세 & 감정 다이어리',
  description: '매일의 사주 운세와 감정을 기록하는 개인 다이어리',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${notoSansKR.variable} ${inter.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
