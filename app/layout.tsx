import type { Metadata } from 'next';
import { Outfit, Montserrat } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'UpCodo Digital — Custom Mobile & Web App Solutions',
  description: 'Transform your ideas into cutting-edge mobile and web applications. Expert app development in Noida.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body className={`${outfit.variable} ${montserrat.variable}`} style={{ background: '#050505', color: '#f0f0f0', margin: 0, padding: 0, fontFamily: 'var(--font-montserrat), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
