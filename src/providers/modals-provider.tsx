"use client";

import { config } from "@/services/config";
import { PropsWithChildren } from "react";
import { ModalCenterProvider, ModalCenter } from "@/packages/modals";
import { LoginModal } from "@/features/auth/components/login/login-modal";
import { SignupModal } from "@/features/auth/components/login/signup-modal";
import { PostCommentsModal } from "@/features/social/components/post-comments-modal/post-comments-modal";
import { ConfirmModal } from "@/features/common/components/confirm-modal/confirm-modal";
import { MagicLinkVerificationModal } from "@/features/auth/components/magic-link-verification-modal/magic-link-verification-modal";
import { ShareModal } from "@/features/common/components/share-modal/share-modal";
import { SocialCreateModal } from "@/features/social/components/social-create-modal/social-create-modal";

const modalsConfig = {
  LoginModal,
  SignupModal,
  PostCommentsModal,
  ConfirmModal,
  MagicLinkVerificationModal,
  ShareModal,
  SocialCreateModal,
};

export type ModalType = keyof typeof modalsConfig;

export const ModalsProvider = ({ children }: PropsWithChildren<object>) => (
  <ModalCenterProvider config={modalsConfig}>
    {children}
    <ModalCenter ignoreIds={[config.misc.notificationCenterId, "123"]} />
  </ModalCenterProvider>
);
