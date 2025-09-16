import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Layout } from "@/components/ui/layout";
import { ApiProvider } from "@/providers/api-provider";
import { ModalsProvider } from "@/providers/modals-provider";
import { NotificationsProvider } from "@/providers/notifications-provider";
// import { EmailVerificationProvider } from "@/providers/email-verification-provider";

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
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ApiProvider>
            <ModalsProvider>
              <Layout>{children}</Layout>
              {/*<EmailVerificationProvider />*/}
            </ModalsProvider>
          </ApiProvider>
        </GoogleOAuthProvider>
        <NotificationsProvider />
      </body>
    </html>
  );
}
