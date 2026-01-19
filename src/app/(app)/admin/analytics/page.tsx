"use client";

import { Users, MessageSquare, Video } from "lucide-react";
import { useAdminAnalytics } from "@/features/admin/queries/use-admin-analytics";
import { AnalyticsChart } from "@/features/admin/components/analytics-chart";

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
}

export default function AdminAnalyticsPage() {
  const [analytics, { isLoading, error }] = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load analytics</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Social Posts",
      value: analytics?.totalSocialPosts ?? 0,
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Videos",
      value: analytics?.totalVideos ?? 0,
      icon: Video,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-base-800 mt-1">
          Overview of platform statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex flex-col gap-4 rounded-xl bg-base-200 p-6 border border-base-400"
          >
            <div className="flex items-center justify-between">
              <span className="text-base-800 text-sm font-medium">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <span className="text-4xl font-bold text-white">
              {formatNumber(stat.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <AnalyticsChart days={30} />
      </div>
    </div>
  );
}
