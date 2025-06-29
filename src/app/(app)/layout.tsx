import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { Layout } from "@/components/ui/layout";
import { ApiProvider } from "@/providers/api-provider";
import { ModalsProvider } from "@/providers/modals-provider";
import {config} from "@/services/config";
import {NotificationsProvider} from "@/providers/notifications-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashy Social",
  description: "Flashy Social is a social media platform for flashy people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiProvider>
          <ModalsProvider>
            <Layout>
              {children}
            </Layout>
          </ModalsProvider>
        </ApiProvider>
        <NotificationsProvider />
      </body>
    </html>
  );
}
