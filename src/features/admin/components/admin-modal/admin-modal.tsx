import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { AdminIcon } from "@/components/ui/icons/admin";
import { PersonIcon } from "@/components/ui/icons/person";
import { PictureIcon } from "@/components/ui/icons/picture";
import { AdminBusinessAccounts } from "@/features/admin/components/admin-modal/admin-business-accounts";
import { AdminUsers } from "@/features/admin/components/admin-modal/admin-users";
import { AdminHomeBanners } from "@/features/admin/components/admin-modal/admin-home-banners";
import { useIsSuperAdmin } from "@/features/auth/hooks/use-is-super-admin";
import { useIsManager } from "@/features/auth/hooks/use-is-manager";

export interface AdminModalProps {
  onClose(): void;
}

export type AdminTab = "business-accounts" | "users" | "home-banners";

export const AdminModal = ({ onClose, ...props }: AdminModalProps) => {
  const [curTab, setCurTab] = useState<AdminTab>(() => "business-accounts");
  const isSuperAdmin = useIsSuperAdmin();
  const isManager = useIsManager()

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
            {isSuperAdmin && (
              <NavLink
                value="users"
                title="Users"
                description="Manage user roles and status"
                icon={<PersonIcon />}
                selected={curTab === "users"}
                onChange={setCurTab}
              />
            )}
            {(isSuperAdmin || isManager) && (
              <NavLink
                value="home-banners"
                title="Home Banners"
                description="Manage home page banners"
                icon={<PictureIcon />}
                selected={curTab === "home-banners"}
                onChange={setCurTab}
              />
            )}
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
              {curTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex grow shrink overflow-hidden"
                >
                  <AdminUsers />
                </motion.div>
              )}
              {curTab === "home-banners" && (
                <motion.div
                  key="home-banners"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex grow shrink overflow-hidden"
                >
                  <AdminHomeBanners />
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
      className={`grid grid-cols-6 w-full p-3 cursor-pointer transition
        ${selected ? "bg-base-300" : "hover:bg-base-250"}`}
      onClick={() => onChange(value)}
    >
      <div className="flex col-span-1 text-white">{icon}</div>
      <div className="flex flex-col col-span-5">
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
