import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { AdminIcon } from "@/components/ui/icons/admin";
import { AdminBusinessAccounts } from "@/features/admin/components/admin-modal/admin-business-accounts";

export interface AdminModalProps {
  onClose(): void;
}

export type AdminTab = "business-accounts";

export const AdminModal = ({ onClose, ...props }: AdminModalProps) => {
  const [curTab, setCurTab] = useState<AdminTab>(() => "business-accounts");

  return (
    <Modal onClose={onClose} className="!p-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md h-[600px]"
      >
        <div className="flex w-full p-4 border-b">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Admin Panel</p>
          </div>
        </div>
        <div className="flex w-full grow shrink overflow-hidden">
          <div className="flex flex-col w-1/3 h-auto bg-base-200 border-r">
            <NavLink
              value="business-accounts"
              title="Business Accounts"
              description="Manage business account requests"
              icon={<AdminIcon />}
              selected={curTab === "business-accounts"}
              onChange={setCurTab}
            />
          </div>
          <div className="flex flex-col grow w-2/3 overflow-hidden">
            <AnimatePresence initial={false}>
              {curTab === "business-accounts" && (
                <motion.div
                  key="business-accounts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex grow shrink overflow-hidden"
                >
                  <AdminBusinessAccounts />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const NavLink = ({
  value,
  title,
  description,
  icon,
  selected,
  onChange,
}: {
  value: AdminTab;
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onChange: (value: AdminTab) => void;
}) => {
  return (
    <div
      className={`flex w-full p-3 items-start justify-between gap-3
        cursor-pointer transition
        ${selected ? "bg-base-300" : "hover:bg-base-250"}`}
      onClick={() => onChange(value)}
    >
      <div className="flex shrink-0 text-white">{icon}</div>
      <div className="flex flex-col">
        <p className="text-md text-white font-bold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[800px] max-w-[800px] !bg-base-300
      !rounded-md max-sm:w-full overflow-hidden ${props.className}`}
  />
);
