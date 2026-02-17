import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";

export const metadata: Metadata = {
  title: "SHSPrep — SHSAT Practice & Prep",
  description: "Free adaptive SHSAT practice for NYC students. Master Math, ELA, and Reading Comprehension with original questions and performance analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
