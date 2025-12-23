import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBusinessAccountsWithUsers } from "@/features/business/queries/use-business-accounts-with-users";
import { useApproveBusinessAccount } from "@/features/business/mutations/use-approve-business-account";
import { useRejectBusinessAccount } from "@/features/business/mutations/use-reject-business-account";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { timeAgo } from "@/lib/utils";

export const AdminBusinessAccounts = () => {
  const [statusFilter, setStatusFilter] = useState<
    BusinessAccountStatus | undefined
  >("pending");

  const { data, query } = useBusinessAccountsWithUsers({
    status: statusFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const approveBusinessAccount = useApproveBusinessAccount();
  const rejectBusinessAccount = useRejectBusinessAccount();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const businessAccounts = data || [];
  const isLoading = query.isLoading;
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;
  const fetchNextPage = query.fetchNextPage;

  const handleApprove = async (id: string) => {
    await approveBusinessAccount.mutateAsync(id);
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    await rejectBusinessAccount.mutateAsync({ id, rejectionReason });
    setRejectingId(null);
    setRejectionReason("");
  };

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-hidden">
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-xl font-bold text-white">Business Accounts</h2>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "pending" ? "default" : "secondary"}
            onClick={() => setStatusFilter("pending")}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "approved" ? "default" : "secondary"}
            onClick={() => setStatusFilter("approved")}
            size="sm"
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "secondary"}
            onClick={() => setStatusFilter("rejected")}
            size="sm"
          >
            Rejected
          </Button>
          <Button
            variant={statusFilter === undefined ? "default" : "secondary"}
            onClick={() => setStatusFilter(undefined)}
            size="sm"
          >
            All
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">Loading...</p>
          </div>
        ) : businessAccounts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">No business accounts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {businessAccounts.map((account: BusinessAccountWithUser) => (
              <div
                key={account._id}
                className="flex flex-col gap-3 p-4 bg-base-200 rounded-lg border
                  border-base-400"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <UserAvatar
                      avatar={account.user?.userimage}
                      className="mt-1"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">
                          {account.user?.username || "Unknown"}
                        </p>
                        {account.user?.email && (
                          <p className="text-sm text-base-700">
                            ({account.user.email})
                          </p>
                        )}
                      </div>
                      <h3 className="font-semibold text-white">
                        {account.title}
                      </h3>
                      <p className="text-sm text-base-700 break-words">
                        {account.description}
                      </p>
                      <div
                        className="flex items-center gap-3 mt-2 text-xs
                          text-base-700"
                      >
                        <span className="px-2 py-1 bg-base-300 rounded">
                          {account.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            account.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : account.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                        >
                          {account.status}
                        </span>
                        <span>{timeAgo(account.createdAt, false)}</span>
                      </div>
                      {account.rejectionReason && (
                        <div
                          className="mt-2 p-2 bg-red-500/10 rounded border
                            border-red-500/20"
                        >
                          <p className="text-sm text-red-400">
                            <span className="font-semibold">
                              Rejection Reason:
                            </span>{" "}
                            {account.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {account.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(account._id)}
                        pending={approveBusinessAccount.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectingId(account._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {rejectingId === account._id && (
                  <div
                    className="flex flex-col gap-2 pt-3 border-t
                      border-base-400"
                  >
                    <label className="text-sm font-semibold text-white">
                      Rejection Reason
                    </label>
                    <textarea
                      className="w-full p-2 bg-base-300 border border-base-400
                        rounded text-white text-sm resize-none
                        focus:outline-none focus:border-primary"
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(account._id)}
                        pending={rejectBusinessAccount.isPending}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              variant="secondary"
              onClick={() => fetchNextPage()}
              pending={isFetchingNextPage}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
