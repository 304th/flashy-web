"use client";

import { config } from "@/services/config";
import { PropsWithChildren } from "react";
import { ModalCenterProvider, ModalCenter } from "@/packages/modals";
import { LoginModal, LoginModalProps } from "@/features/auth/components/login/login-modal";
import { SignupModal, SignupModalProps } from "@/features/auth/components/login/signup-modal";
import { PostCommentsModal, PostCommentsModalProps } from "@/features/social/components/post-comments-modal/post-comments-modal";
import { ConfirmModal, ConfirmModalProps } from "@/features/common/components/confirm-modal/confirm-modal";
import { ImageViewerModal, ImageViewerModalProps } from "@/features/common/components/image-viewer-modal/image-viewer-modal";
import { MagicLinkVerificationModal, MagicLinkVerificationModalProps } from "@/features/auth/components/magic-link-verification-modal/magic-link-verification-modal";
import { ShareModal, ShareModalProps } from "@/features/common/components/share-modal/share-modal";
import { SocialCreateModal } from "@/features/social/components/social-create-modal/social-create-modal";
import { BuyKeyModal, BuyKeyModalProps } from "@/features/keys/components/buy-key-modal/buy-key-modal";
import { ProfileSettingsModal, ProfileSettingsModalProps } from "@/features/profile/components/profile-settings-modal/profile-settings-modal";

const modalsConfig = {
  LoginModal,
  SignupModal,
  PostCommentsModal,
  ConfirmModal,
  ImageViewerModal,
  MagicLinkVerificationModal,
  ShareModal,
  SocialCreateModal,
  BuyKeyModal,
  ProfileSettingsModal,
};

export type ModalType = keyof typeof modalsConfig;

export interface ModalTypeConfig<T extends ModalType, P extends Record<string, any>> {
  type: T,
  props: P,
}

export type ModalPropsTypes = {
  type: 'LoginModal',
  props: LoginModalProps,
} | {
  type: 'SignupModal',
  props: SignupModalProps,
} | {
  type: 'PostCommentsModal',
  props: PostCommentsModalProps,
} | {
  type: 'ConfirmModal',
  props: ConfirmModalProps,
} | {
  type: 'ImageViewerModal',
  props: ImageViewerModalProps,
} | {
  type: 'MagicLinkVerificationModal',
  props: MagicLinkVerificationModalProps,
} | {
  type: 'ShareModal',
  props: ShareModalProps,
} | {
  type: 'SocialCreateModal',
  props: null,
} | {
  type: 'BuyKeyModal',
  props: BuyKeyModalProps,
} | {
  type: 'ProfileSettingsModal',
  props: ProfileSettingsModalProps,
};

export const ModalsProvider = ({ children }: PropsWithChildren<object>) => (
  <ModalCenterProvider config={modalsConfig}>
    {children}
    <ModalCenter ignoreIds={[config.misc.notificationCenterId, "123"]} />
  </ModalCenterProvider>
);
