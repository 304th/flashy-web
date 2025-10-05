import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal as ModalComponent } from "@/packages/modals";
import { Form } from "@/components/ui/form";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@/components/ui/icons/person";
import { LinkIcon } from "@/components/ui/icons/link";
import { ProfileSettingsProfile } from "@/features/profile/components/profile-settings-modal/profile-settings-profile";
import { ProfileSettingsSocialLinks } from "@/features/profile/components/profile-settings-modal/profile-settings-social-links";
import { HelpIcon } from "@/components/ui/icons/help";
import { useMe } from "@/features/auth/queries/use-me";
import { useUpdateUsername } from "@/features/profile/mutations/use-update-username";
import { useUpdateUserInfo } from "@/features/profile/mutations/use-update-user-info";
import {uploadImage} from "@/features/common/mutations/use-upload-image";
import {createSignedUploadUrlMutation} from "@/features/common/mutations/use-create-signed-upload-url";
import {useUpdateBanner} from "@/features/profile/mutations/use-update-banner";
import {useUpdateAvatar} from "@/features/profile/mutations/use-update-avatar";
import { prune } from "@/lib/utils";

export interface ProfileSettingsModalProps {
  onClose(): void;
}

export type ProfileSettingsTab = "profile" | "social-links";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .refine((val) => !val.includes(" "), "Username cannot contain spaces"),
  bio: z.string().optional(),
  banner: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  bannerUpload: z.instanceof(File).optional(),
  avatarUpload: z.instanceof(File).optional(),
  links: z
    .object({
      x: z.string().url().optional(),
      youtube: z.string().url().optional(),
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

export const ProfileSettingsModal = ({
  onClose,
  ...props
}: ProfileSettingsModalProps) => {
  const { data: me } = useMe();
  const [curTab, setCurTab] = useState<ProfileSettingsTab>(() => "profile");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: me?.username,
      bio: me?.bio,
      banner: me?.banner,
      avatar: me?.userimage,
      links: {
        x: me?.links?.x,
        youtube: me?.links?.youtube,
        instagram: me?.links?.instagram,
        linkedin: me?.links?.linkedin,
        website: me?.links?.website,
      },
    },
    mode: "all",
  });

  const updateUsername = useUpdateUsername();
  const updateUserInfo = useUpdateUserInfo();
  const updateBanner = useUpdateBanner();
  const updateAvatar = useUpdateAvatar();

  return (
    <Modal onClose={onClose} className="!p-0" {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (params) => {
            // Upload images first
            if (params.bannerUpload) {
              const { uploadUrl, fileType } =
                await createSignedUploadUrlMutation.writeData({
                  fileName: params.bannerUpload.name,
                  fileType: params.bannerUpload.type,
                });

              const banner = await uploadImage.writeData({
                file: params.bannerUpload,
                type: fileType,
                uploadUrl: uploadUrl,
              });

              updateBanner.mutate({
                banner,
              })
            }

            if (params.avatarUpload) {
              const { uploadUrl, fileType } =
                await createSignedUploadUrlMutation.writeData({
                  fileName: params.avatarUpload.name,
                  fileType: params.avatarUpload.type,
                });

              const userimage = await uploadImage.writeData({
                file: params.avatarUpload,
                type: fileType,
                uploadUrl: uploadUrl,
              });

              updateAvatar.mutate({
                userimage,
              })
            }

            if (params.username && me?.username !== params.username) {
              updateUsername.mutate({ username: params.username });
            }

            if (
              (params.bio && me?.bio !== params.bio) ||
              Object.keys(params?.links || {}).length !== 0
            ) {
              updateUserInfo.mutate({
                bio: params.bio,
                links: prune(params.links || {}),
              });
            }

            if (params.banner === null) {
              updateBanner.mutate({
                banner: '',
              })
            }

            if (params.avatar === null) {
              updateAvatar.mutate({
                userimage: '',
              })
            }

            onClose();
          })}
        >
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
                <p className="text-2xl font-extrabold text-white">
                  Profile Settings
                </p>
              </div>
            </div>
            <div className="flex w-full grow shrink overflow-hidden">
              <div className="flex flex-col w-1/3 h-auto bg-base-200 border-r">
                <NavLink
                  value="profile"
                  title="Profile"
                  description="Edit your public info. Including: Username & Banner"
                  icon={<PersonIcon />}
                  selected={curTab === "profile"}
                  onChange={setCurTab}
                />
                <NavLink
                  value="social-links"
                  title="Social Links"
                  description="Link your existing social-media accounts to Flashy"
                  icon={<LinkIcon />}
                  selected={curTab === "social-links"}
                  onChange={setCurTab}
                />
              </div>
              <div className="flex flex-col grow w-2/3">
                <AnimatePresence initial={false}>
                  {curTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex grow shrink overflow-hidden PROFILE"
                    >
                      <ProfileSettingsProfile />
                    </motion.div>
                  )}
                  {curTab === "social-links" && (
                    <motion.div
                      key="social-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex grow"
                    >
                      <ProfileSettingsSocialLinks />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className="flex w-full justify-between items-center gap-2 p-4
                    border-t"
                >
                  <div className="flex w-full items-center gap-1 text-base-800">
                    <HelpIcon />
                    <p className="text-xs">
                      Change will take place immediately
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!form.formState.isDirty}
                    pending={form.formState.isSubmitting}
                    className="min-w-[70px]"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </Form>
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
  value: ProfileSettingsTab;
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onChange: (value: ProfileSettingsTab) => void;
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
    className={`sm:min-w-unset min-w-[800px] !bg-base-300 !rounded-md sm:w-full
      overflow-hidden ${props.className}`}
  />
);
