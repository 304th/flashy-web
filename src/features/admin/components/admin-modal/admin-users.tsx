import { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAdminUsersSearch } from "@/features/admin/queries/use-admin-users-search";
import { useUpdateUserStatus } from "@/features/admin/mutations/use-update-user-status";
import { Spinner } from "@/components/ui/spinner/spinner";

interface UserStatusField {
  key: "verified" | "moderator" | "manager" | "representative" | "isAssociate";
  label: string;
}

const STATUS_FIELDS: UserStatusField[] = [
  { key: "verified", label: "Verified" },
  { key: "moderator", label: "Moderator" },
  { key: "manager", label: "Manager" },
  { key: "representative", label: "Rep" },
  { key: "isAssociate", label: "Associate" },
];

export const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });
  const [foundUsers, usersSearchQuery] = useAdminUsersSearch(debouncedSearch);

  const isLoading = usersSearchQuery.isLoading;
  const users = foundUsers || [];

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-hidden">
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : !debouncedSearch || debouncedSearch.length < 2 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">Enter username or email to search</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user: User) => (
              <UserRow key={user.fbId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UserRow = ({ user }: { user: User }) => {
  const updateUserStatus = useUpdateUserStatus();
  const [statuses, setStatuses] = useState({
    verified: user.verified || false,
    moderator: user.moderator || false,
    manager: user.manager || false,
    representative: user.representative || false,
    isAssociate: user.isAssociate || false,
  });

  const handleToggle = async (
    field: UserStatusField["key"],
    checked: boolean,
  ) => {
    const previousValue = statuses[field];
    setStatuses((prev) => ({ ...prev, [field]: checked }));

    try {
      await updateUserStatus.mutateAsync({
        fbId: user.fbId,
        [field]: checked,
      });
    } catch (error) {
      setStatuses((prev) => ({ ...prev, [field]: previousValue }));
    }
  };

  return (
    <div className="p-3 bg-base-200 rounded-lg border border-base-400">
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar avatar={user.userimage} className="shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-semibold text-white truncate">{user.username}</p>
          {user.email && (
            <p className="text-xs text-base-700 truncate">{user.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {STATUS_FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Switch.Root
              checked={statuses[field.key]}
              onCheckedChange={(checked) => handleToggle(field.key, checked)}
            />
            <span className="text-sm text-white">{field.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
