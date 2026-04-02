import type { Metadata } from 'next';
import { Syne, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vesurathan | AI, Data Engineering & Computer Vision',
  description: 'Vesurathan — AI, data engineering, big data analytics, and computer vision. Built with Next.js.',
};  

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} noise-overlay`}
    >
      <body className="min-h-screen bg-void font-body relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
