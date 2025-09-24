import {ReactNode, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@/components/ui/icons/person";
import { LinkIcon } from "@/components/ui/icons/link";
import {ProfileSettingsProfile} from "@/features/profile/components/profile-settings-modal/profile-settings-profile";
import {
  ProfileSettingsSocialLinks
} from "@/features/profile/components/profile-settings-modal/profile-settings-social-links";

export interface ProfileSettingsModalProps {
  onClose(): void;
}

export type ProfileSettingsTab = "profile" | "social-links";

export const ProfileSettingsModal = ({
  onClose,
  ...props
}: ProfileSettingsModalProps) => {
  const [curTab, setCurTab] = useState<ProfileSettingsTab>(() => "profile");

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md"
      >
        <div className="flex w-full p-4 border-b">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Profile Settings</p>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col w-1/3 h-full bg-base-200 min-h-[400px] border-r">
            <NavLink
              value="profile"
              title="Profile"
              description="Edit your public info. Including: Username & Banner"
              icon={<PersonIcon />}
              selected={curTab === 'profile'}
              onChange={setCurTab}
            />
            <NavLink
              value="social-links"
              title="Social Links"
              description="Link your existing social-media accounts to Flashy"
              icon={<LinkIcon />}
              selected={curTab === 'social-links'}
              onChange={setCurTab}
            />
          </div>
          <div className="flex flex-col grow w-2/3">
            <AnimatePresence initial={false}>
              {
                curTab === 'profile' && <ProfileSettingsProfile />
              }
              {
                curTab === 'social-links' && <ProfileSettingsSocialLinks />
              }
            </AnimatePresence>
            <div className="flex w-full justify-end gap-2 p-4 border-t">
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const NavLink = ({ value, title, description, icon, selected, onChange }: { value: ProfileSettingsTab; title: string; description: string; icon: ReactNode; selected: boolean; onChange: (value: ProfileSettingsTab) => void }) => {
  return <div className={`flex w-full p-3 items-start justify-between gap-3 cursor-pointer transition ${selected ? 'bg-base-300' : 'hover:bg-base-300'}`} onClick={() => onChange(value)}>
    <div className="flex shrink-0 text-white">{icon}</div>
    <div className="flex flex-col">
      <p className="text-md text-white font-bold">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  </div>
}

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[800px] !bg-base-300
      !rounded-md sm:w-full overflow-hidden ${props.className}`}
  />
);
