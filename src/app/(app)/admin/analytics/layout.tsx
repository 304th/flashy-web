"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/queries/use-me";

export default function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: me, query } = useMe();

  const isLoading = query.isLoading || !query.isFetched;
  const hasAccess = me?.manager || me?.superAdmin;

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.replace("/");
    }
  }, [hasAccess, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
