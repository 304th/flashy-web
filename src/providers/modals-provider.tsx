"use client";

import config from "@/config";
import { PropsWithChildren } from "react";
import { ModalCenterProvider, ModalCenter } from "@/packages/modals";
import {
  LoginModal,
  LoginModalProps,
} from "@/features/auth/components/login/login-modal";
import {
  SignupModal,
  SignupModalProps,
} from "@/features/auth/components/login/signup-modal";
import {
  PostCommentsModal,
  PostCommentsModalProps,
} from "@/features/social/components/post-comments-modal/post-comments-modal";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/features/common/components/confirm-modal/confirm-modal";
import {
  ImageViewerModal,
  ImageViewerModalProps,
} from "@/features/common/components/image-viewer-modal/image-viewer-modal";
import {
  ShareModal,
  ShareModalProps,
} from "@/features/common/components/share-modal/share-modal";
import { SocialCreateModal } from "@/features/social/components/social-create-modal/social-create-modal";
import {
  BuyKeyModal,
  BuyKeyModalProps,
} from "@/features/keys/components/buy-key-modal/buy-key-modal";
import {
  SellKeyModal,
  SellKeyModalProps,
} from "@/features/keys/components/sell-key-modal/sell-key-modal";
import {
  ProfileSettingsModal,
  ProfileSettingsModalProps,
} from "@/features/profile/components/profile-settings-modal/profile-settings-modal";
import {
  VideoCreateModal,
  VideoCreateModalProps,
} from "@/features/video/components/video-create-modal/video-create-modal";
import {
  TipModal,
  TipModalProps,
} from "@/features/wallet/components/tip-modal/tip-modal";
import {
  PlaylistCreateModal,
  PlaylistCreateModalProps,
} from "@/features/video/components/playlist-create-modal/playlist-create-modal";

const modalsConfig = {
  LoginModal,
  SignupModal,
  PostCommentsModal,
  ConfirmModal,
  ImageViewerModal,
  ShareModal,
  SocialCreateModal,
  BuyKeyModal,
  ProfileSettingsModal,
  SellKeyModal,
  VideoCreateModal,
  TipModal,
  PlaylistCreateModal,
};

export type ModalPropsTypes =
  | {
      type: "LoginModal";
      props: LoginModalProps;
    }
  | {
      type: "SignupModal";
      props: SignupModalProps;
    }
  | {
      type: "PostCommentsModal";
      props: PostCommentsModalProps;
    }
  | {
      type: "ConfirmModal";
      props: ConfirmModalProps;
    }
  | {
      type: "ImageViewerModal";
      props: ImageViewerModalProps;
    }
  | {
      type: "ShareModal";
      props: ShareModalProps;
    }
  | {
      type: "SocialCreateModal";
      props: null;
    }
  | {
      type: "BuyKeyModal";
      props: BuyKeyModalProps;
    }
  | {
      type: "ProfileSettingsModal";
      props: ProfileSettingsModalProps;
    }
  | {
      type: "SellKeyModal";
      props: SellKeyModalProps;
    }
  | {
      type: "VideoCreateModal";
      props: VideoCreateModalProps;
    }
  | {
      type: "TipModal";
      props: TipModalProps;
    }
  | {
      type: "PlaylistCreateModal";
      props: PlaylistCreateModalProps;
    };

export const ModalsProvider = ({ children }: PropsWithChildren<object>) => (
  <ModalCenterProvider config={modalsConfig}>
    {children}
    <ModalCenter ignoreIds={[config.misc.notificationCenterId, "123"]} />
  </ModalCenterProvider>
);
