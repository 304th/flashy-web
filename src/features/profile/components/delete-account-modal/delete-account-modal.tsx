import { useState } from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMe } from "@/features/auth/queries/use-me";
import { useDeleteAccount } from "@/features/profile/mutations/use-delete-account";

export interface DeleteAccountModalProps {
  onClose(): void;
}

export const DeleteAccountModal = ({
  onClose,
  ...props
}: DeleteAccountModalProps) => {
  const { data: me } = useMe();
  const deleteAccount = useDeleteAccount();
  const [username, setUsername] = useState("");

  const isMatch = username === me?.username;

  return (
    <Modal onClose={onClose} className="!p-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-4 gap-5 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center gap-2">
            <p className="text-2xl font-extrabold text-white">Delete Account</p>
            <p className="text-sm text-base-800">
              This action is{" "}
              <span className="text-red-400 font-semibold">permanent</span> and
              cannot be undone. All your data, posts, and content will be
              removed.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-white">
            To confirm, type your username{" "}
            <span className="font-bold text-white">{me?.username}</span> below:
          </p>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="off"
          />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!isMatch}
            pending={deleteAccount.isPending}
            onClick={() => deleteAccount.mutate()}
          >
            Delete Account
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset max-w-[550px] min-w-[500px] !bg-base-300
      !rounded-md max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
