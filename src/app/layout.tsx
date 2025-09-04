import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ryan Radityatama - AI & Software Engineer",
  description: "AI & Software Engineer, Machine Learning Expert, and Full Stack Developer specializing in intelligent solutions that make technology more human-friendly.",
  keywords: "Ryan Radityatama, AI Engineer, Software Engineer, Machine Learning, Full Stack Developer, Python, React, Next.js",
  authors: [{ name: "Ryan Radityatama" }],
  creator: "Ryan Radityatama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
