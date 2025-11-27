"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MonetiseStatsCardProps {
  title: string;
  icon: ReactNode;
  count?: number;
  link: string;
  className?: string;
}

export function MonetiseStatsCard({
  title,
  icon,
  count,
  link,
  className,
}: MonetiseStatsCardProps) {
  return (
    <Link
      href={link}
      className="flex flex-col items-center justify-center gap-3 rounded-lg
        bg-base-300 p-3 min-h-[120px] transition hover:bg-base-400
        cursor-pointer"
    >
      <div className="text-base-700">{icon}</div>
      <div className="flex items-center gap-8">
        <span className="text-lg text-white font-medium">{title}</span>
        {count !== undefined && (
          <span className="text-lg text-white">{count}</span>
        )}
      </div>
    </Link>
  );
}
