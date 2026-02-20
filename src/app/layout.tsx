import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { AppLoader } from "@/components/ui/AppLoader";

export const metadata: Metadata = {
  title: 'SHS Prep — SHSAT Practice for NYC Students',
  description: 'Free adaptive SHSAT prep platform with 500+ original practice questions, mock exams, and performance analytics for NYC middle school students.',
  keywords: ['SHSAT', 'SHSAT prep', 'NYC specialized high schools', 'SHSAT practice', 'Stuyvesant', 'Bronx Science', 'Brooklyn Tech'],
  openGraph: {
    title: 'SHS Prep — SHSAT Practice for NYC Students',
    description: 'Adaptive SHSAT prep with 500+ questions, mock exams, and analytics.',
    url: 'https://shsprep.com',
    siteName: 'SHS Prep',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHS Prep — SHSAT Practice',
    description: 'Adaptive SHSAT prep with 500+ questions, mock exams, and analytics.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-deep-forest focus:rounded-lg focus:shadow-lg focus:font-bold focus:text-sm"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <AppLoader />
          <main id="main-content">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
