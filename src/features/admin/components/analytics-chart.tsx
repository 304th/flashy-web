"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAdminAnalyticsHistory } from "../queries/use-admin-analytics-history";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
}

interface AnalyticsChartProps {
  days?: number;
}

export function AnalyticsChart({ days = 30 }: AnalyticsChartProps) {
  const [history, { isLoading, error }] = useAdminAnalyticsHistory(days);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-xl bg-base-200 border border-base-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-xl bg-base-200 border border-base-400">
        <p className="text-red-500">Failed to load analytics history</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-xl bg-base-200 border border-base-400">
        <p className="text-base-800">
          No historical data available yet. Data will appear after the daily
          snapshot runs.
        </p>
      </div>
    );
  }

  const chartData = history.map((item) => ({
    ...item,
    dateLabel: formatDate(item.date),
  }));

  return (
    <div className="rounded-xl bg-base-200 p-6 border border-base-400">
      <h2 className="text-lg font-semibold text-white mb-4">
        Historical Trends (Last {days} Days)
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="dateLabel"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              tickLine={{ stroke: "#9ca3af" }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              tickLine={{ stroke: "#9ca3af" }}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name) => [
                formatNumber(value as number),
                name === "totalUsers"
                  ? "Users"
                  : name === "totalSocialPosts"
                    ? "Social Posts"
                    : name === "totalVideos"
                      ? "Videos"
                      : "Streams Started",
              ]}
            />
            <Legend
              wrapperStyle={{ color: "#9ca3af" }}
              formatter={(value) =>
                value === "totalUsers"
                  ? "Users"
                  : value === "totalSocialPosts"
                    ? "Social Posts"
                    : value === "totalVideos"
                      ? "Videos"
                      : "Streams Started"
              }
            />
            <Line
              type="monotone"
              dataKey="totalUsers"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="totalSocialPosts"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="totalVideos"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="totalStreamsStarted"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
