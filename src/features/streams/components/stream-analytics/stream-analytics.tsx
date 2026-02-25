import { useStreamAnalytics } from "@/features/streams/queries/use-stream-analytics";
import { Eye, Clock, TrendingUp, MessageSquare } from "lucide-react";

interface StreamAnalyticsProps {
  streamId: string;
}

export const StreamAnalytics = ({ streamId }: StreamAnalyticsProps) => {
  const [analytics, query] = useStreamAnalytics(streamId);

  if (query.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 animate-pulse bg-muted">
            <div className="h-8 bg-background rounded mb-2" />
            <div className="h-4 bg-background rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      icon: Eye,
      label: "Current Viewers",
      value: analytics.viewerCount.toLocaleString(),
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      color: "text-green-500",
    },
    {
      icon: Clock,
      label: "Avg. Watch Time",
      value: formatDuration(analytics.averageWatchTime),
      color: "text-purple-500",
    },
    {
      icon: MessageSquare,
      label: "Chat Messages",
      value: analytics.chatMessagesCount?.toLocaleString?.(),
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}

      {analytics.peakViewers > 0 && (
        <div className="col-span-2 md:col-span-4 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Peak Viewers</p>
              <p className="text-xl font-bold">
                {analytics.peakViewers?.toLocaleString?.()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
