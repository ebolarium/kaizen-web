import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kaizen - Education NGO",
  description: "Continuous improvement through education and community development. Empowering communities through innovative educational programs and international partnerships.",
  keywords: ["education", "NGO", "community development", "Erasmus+", "youth leadership", "sustainable development"],
  authors: [{ name: "Kaizen Education NGO" }],
  openGraph: {
    title: "Kaizen - Education NGO",
    description: "Continuous improvement through education and community development",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
