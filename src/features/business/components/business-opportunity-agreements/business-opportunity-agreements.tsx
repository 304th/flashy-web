"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOpportunitySubmissions } from "@/features/business";
import type { OpportunitySubmissionWithCreator } from "@/features/business";

interface BusinessOpportunityAgreementsProps {
  opportunityId: string;
}

const STATUS_MAP: Record<CreatorOpportunityStatus, string> = {
  accepted: "active",
  "pending-deliverables": "pending",
  submitted: "pending",
  "under-review": "pending",
  approved: "completed",
  rejected: "rejected",
  expired: "rejected",
  completed: "completed",
};

export function BusinessOpportunityAgreements({
  opportunityId,
}: BusinessOpportunityAgreementsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");

  const { data: submissions, query } = useOpportunitySubmissions({
    opportunityId,
  });
  const isLoading = query.isLoading;

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];

    return submissions.filter((submission) => {
      const matchesSearch =
        searchQuery === "" ||
        submission.creator?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        submission.creator?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const mappedStatus = STATUS_MAP[submission.status] || "pending";
      const matchesStatus =
        statusFilter === "all" || mappedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const getStatusColor = (status: CreatorOpportunityStatus) => {
    const mappedStatus = STATUS_MAP[status] || "pending";
    switch (mappedStatus) {
      case "active":
        return "bg-brand-100";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-base-600";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-base-700">
        Loading agreements...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-64">
          <Search
            className="absolute z-1 left-3 top-1/2 -translate-y-1/2 w-4 h-4
              text-base-700"
          />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-base-200 border-base-400 h-8"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            variant="compact"
            size="xsmall"
          >
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
            <Select.Item value="rejected">Rejected</Select.Item>
          </Select.Root>

          <Select.Root
            value={timeFilter}
            onValueChange={setTimeFilter}
            variant="compact"
            size="xsmall"
          >
            <Select.Item value="past-12-months">Past 12 Months</Select.Item>
            <Select.Item value="past-6-months">Past 6 Months</Select.Item>
            <Select.Item value="past-3-months">Past 3 Months</Select.Item>
            <Select.Item value="past-month">Past Month</Select.Item>
          </Select.Root>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-base-600">
              <th
                className="text-left py-3 px-4 text-sm font-medium
                  text-base-800"
              >
                Creator
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-medium
                  text-base-800"
              >
                Email
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-medium
                  text-base-800"
              >
                Applied Date
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-medium
                  text-base-800"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-base-700">
                  No agreements found
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((submission) => (
                <tr
                  key={submission._id}
                  onClick={() =>
                    router.push(`/business/agreements?id=${submission._id}`)
                  }
                  className="border-b border-base-600 hover:bg-base-300/50
                    transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 text-sm text-white">
                    {submission.creator?.username || "Unknown"}
                  </td>
                  <td className="py-4 px-4 text-sm text-brand-100">
                    {submission.creator?.email || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-white">
                    {formatDate(submission.appliedAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          getStatusColor(submission.status),
                        )}
                      />
                      <span className="text-sm text-base-700 capitalize">
                        {submission.status.replace(/-/g, " ")}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
