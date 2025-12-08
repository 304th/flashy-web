"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Agreement {
  _id: string;
  opportunityTitle: string;
  agreementType: string;
  username: string;
  email: string;
  dateCreated: string;
  status: "active" | "pending" | "completed" | "rejected";
}

interface BusinessOpportunityAgreementsProps {
  opportunityId: string;
}

// Mock data - will be replaced with real API data
const mockAgreements: Agreement[] = [
  {
    _id: "1",
    opportunityTitle: "Hemp Rolling Papers",
    agreementType: "Sponsorship",
    username: "WAGMI 2026",
    email: "wagmi@gmail.com",
    dateCreated: "25/11/2025",
    status: "active",
  },
  {
    _id: "2",
    opportunityTitle: "Hemp Rolling Papers",
    agreementType: "Sponsorship",
    username: "example name",
    email: "example@gmail.com",
    dateCreated: "25/11/2025",
    status: "active",
  },
  {
    _id: "3",
    opportunityTitle: "Hemp Rolling Papers",
    agreementType: "Sponsorship",
    username: "JosephFlex",
    email: "joe72@example.com",
    dateCreated: "25/11/2025",
    status: "active",
  },
  {
    _id: "4",
    opportunityTitle: "Hemp Rolling Papers",
    agreementType: "Sponsorship",
    username: "another name",
    email: "anutha@gmail.com",
    dateCreated: "25/11/2025",
    status: "active",
  },
];

export function BusinessOpportunityAgreements({
  opportunityId,
}: BusinessOpportunityAgreementsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");

  // TODO: Replace with real API call
  const agreements = mockAgreements;
  const isLoading = false;

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      searchQuery === "" ||
      agreement.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || agreement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Agreement["status"]) => {
    switch (status) {
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-700" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-base-200 border-base-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            variant="compact"
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
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Agreement ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Agreement Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Username
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Date Created
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAgreements.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-base-700"
                >
                  No agreements found
                </td>
              </tr>
            ) : (
              filteredAgreements.map((agreement) => (
                <tr
                  key={agreement._id}
                  className="border-b border-base-600 hover:bg-base-300/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-white">
                    {agreement.opportunityTitle}
                  </td>
                  <td className="py-4 px-4 text-sm text-brand-100">
                    {agreement.agreementType}
                  </td>
                  <td className="py-4 px-4 text-sm text-white">
                    {agreement.username}
                  </td>
                  <td className="py-4 px-4 text-sm text-brand-100">
                    {agreement.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-white">
                    {agreement.dateCreated}
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(agreement.status)
                      )}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-base-700 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
