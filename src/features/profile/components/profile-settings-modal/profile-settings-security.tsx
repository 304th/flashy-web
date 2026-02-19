import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";

export const ProfileSettingsSecurity = () => {
  const { openModal } = useModals();

  const handleDeleteAccount = () => {
    openModal("DeleteAccountModal", {});
  };

  return (
    <div
      className="flex flex-col gap-3 p-4 w-full grow items-center max-h-[500px]
        overflow-scroll"
    >
      <div className="flex flex-col w-full gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Danger Zone</h3>
          <p className="text-sm text-base-800 mt-1">
            Irreversible and destructive actions
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-red-500/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="text-sm text-base-800">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              className="shrink-0"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
