import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashy Social",
  description: "Flashy Social is a social media platform for flashy people.",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body className={`${figtree.variable} antialiased`}>{children}</body>
    </html>
  );
}
