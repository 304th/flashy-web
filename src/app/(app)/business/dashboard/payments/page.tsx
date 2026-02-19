"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { StatCard } from "@/features/business/components/stat-card/stat-card";
import { useSponsorPayments } from "@/features/business/queries/use-sponsor-payments";
import { useMarkPaymentPaid } from "@/features/business/mutations/use-mark-payment-paid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PaymentStatusFilter = "all" | PaymentStatus;

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const formatAmount = (
  amount?: number | null,
  currency?: PaymentCurrency,
) => {
  if (amount === null || amount === undefined) return "-";
  if (currency === "blaze") {
    return `${amount.toLocaleString()} BLAZE`;
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function BusinessDashboardPaymentsPage() {
  const [statusFilter, setStatusFilter] =
    useState<PaymentStatusFilter>("all");

  const query = useSponsorPayments({
    paymentStatus: statusFilter === "all" ? undefined : statusFilter,
  });

  const payments = query.data?.payments ?? [];
  const summary = query.data?.summary;

  const markPaid = useMarkPaymentPaid();

  const handleMarkPaid = (
    creatorOpportunityId: string,
    compensation?: string,
  ) => {
    const parsed = compensation
      ? parseFloat(compensation.replace(/[^0-9.]/g, ""))
      : undefined;

    markPaid.mutate(
      {
        creatorOpportunityId,
        amount: parsed && !isNaN(parsed) ? parsed : undefined,
      },
      {
        onSuccess: () => toast.success("Payment marked as paid"),
        onError: (error: any) =>
          toast.error(error?.message || "Failed to mark payment"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Payments"
          value={String(summary?.pendingCount ?? 0)}
          changePercentage=""
        />
        <StatCard
          title="Completed Payments"
          value={String(summary?.paidCount ?? 0)}
          changePercentage=""
        />
        <StatCard
          title="Total Paid"
          value={
            summary?.totalPaid
              ? `$${summary.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "$0.00"
          }
          changePercentage=""
        />
      </div>

      <div className="flex gap-3 items-center justify-end">
        <Select.Root
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as PaymentStatusFilter)
          }
          variant="compact"
          size="xsmall"
        >
          <Select.Item value="all">All Payments</Select.Item>
          <Select.Item value="unpaid">Pending</Select.Item>
          <Select.Item value="paid">Paid</Select.Item>
        </Select.Root>
      </div>

      <div>
        <Loadable
          queries={[query] as any}
          defaultFallbackClassname="flex w-full justify-center items-center"
        >
          {() => {
            if (payments.length === 0) {
              return <NotFound>No payments found</NotFound>;
            }

            return (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-base-600">
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Creator
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Opportunity
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Approved
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-base-800">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="border-b border-base-600 hover:bg-base-300/50
                          transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {payment.creator?.userimage && (
                              <img
                                src={payment.creator.userimage}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="text-sm text-white font-medium">
                                {payment.creator?.username ?? "Unknown"}
                              </p>
                              {payment.creator?.email && (
                                <p className="text-xs text-brand-100">
                                  {payment.creator.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-white">
                          {payment.opportunity?.title ?? "-"}
                        </td>
                        <td className="py-4 px-4 text-sm text-white">
                          {payment.paymentStatus === "paid"
                            ? formatAmount(
                                payment.paymentAmount,
                                payment.paymentCurrency,
                              )
                            : payment.opportunity?.compensation
                              ? payment.opportunity?.compensationType === "commission"
                                ? `${payment.opportunity.compensation}%`
                                : `$${payment.opportunity.compensation}`
                              : "-"}
                        </td>
                        <td className="py-4 px-4 text-sm text-white">
                          {formatDate(payment.approvedAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full",
                                payment.paymentStatus === "paid"
                                  ? "bg-green-500"
                                  : "bg-yellow-500",
                              )}
                            />
                            <span className="text-sm text-base-700">
                              {payment.paymentStatus === "paid"
                                ? "Paid"
                                : "Pending"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {payment.paymentStatus !== "paid" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleMarkPaid(
                                  payment._id,
                                  payment.opportunity?.compensation,
                                )
                              }
                              disabled={markPaid.isPending}
                            >
                              Mark Paid
                            </Button>
                          ) : (
                            <span className="text-xs text-base-700">
                              {formatDate(payment.paidAt)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }}
        </Loadable>
      </div>
    </div>
  );
}
