import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Layout } from "@/components/ui/layout";
import { ApiProvider } from "@/providers/api-provider";
import { ModalsProvider } from "@/providers/modals-provider";
import { NotificationsProvider } from "@/providers/notifications-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import { VerificationProvider } from "@/providers/verification-provider";
import { LiveEventsProvider } from "@/providers/live-events-provider";
import { FingerprintProvider } from "@/providers/fingerprint-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";

const figtree = Figtree({
  variable: "--font-figtree",
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
        className={`${figtree.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ApiProvider>
            <ModalsProvider>
              <LoadingProvider />
              <VerificationProvider />
              <LiveEventsProvider />
              <FingerprintProvider />
              <SidebarProvider>
                <Layout>{children}</Layout>
              </SidebarProvider>
            </ModalsProvider>
          </ApiProvider>
        </GoogleOAuthProvider>
        <NotificationsProvider />
      </body>
    </html>
  );
}
