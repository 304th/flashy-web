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
import {
  PlaylistViewModal,
  PlaylistViewModalProps,
} from "@/features/video/components/playlist-view-modal/playlist-view-modal";
import {
  PlaylistUpdateVideosModal,
  PlaylistUpdateVideosModalProps,
} from "@/features/video/components/playlist-update-videos-modal/playlist-update-videos-modal";
import {
  PlaylistEditModal,
  PlaylistEditModalProps,
} from "@/features/video/components/playlist-edit-modal/playlist-edit-modal";
import {
  VideoEditModal,
  VideoEditModalProps,
} from "@/features/video/components/video-edit-modal/video-edit-modal";
import {
  ConversationCreateModal,
  ConversationCreateModalProps,
} from "@/features/messaging/components/conversation-create-modal/conversation-create-modal";
import {
  SignInModal,
  type SignInModalProps,
} from "@/features/auth/components/login/signin-modal";
import {
  MagicLinkVerificationModal,
  type MagicLinkVerificationModalProps,
} from "@/features/auth/components/magic-link-verification-modal/magic-link-verification-modal";
import {
  StreamCreateModal,
  StreamCreateModalProps,
} from "@/features/streams/components/stream-create-modal/stream-create-modal";
import {
  StreamKeyModal,
  StreamKeyModalProps,
} from "@/features/streams/components/stream-key-modal/stream-key-modal";
import {
  StreamSettingsModal,
  StreamSettingsModalProps,
} from "@/features/streams/components/stream-settings-modal/stream-settings-modal";
import {
  GoLiveModal,
  type GoLiveModalProps,
} from "@/features/streams/components/go-live-modal/go-live-modal";
import {
  FollowersModal,
  FollowersModalProps,
} from "@/features/channels/components/followers-modal/followers-modal";
import {
  FollowingModal,
  FollowingModalProps,
} from "@/features/channels/components/following-modal/following-modal";

const modalsConfig = {
  LoginModal,
  SignupModal,
  SignInModal,
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
  PlaylistViewModal,
  PlaylistUpdateVideosModal,
  PlaylistEditModal,
  VideoEditModal,
  ConversationCreateModal,
  MagicLinkVerificationModal,
  StreamCreateModal,
  GoLiveModal,
  StreamKeyModal,
  StreamSettingsModal,
  FollowersModal,
  FollowingModal,
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
      type: "VideoEditModal";
      props: VideoEditModalProps;
    }
  | {
      type: "TipModal";
      props: TipModalProps;
    }
  | {
      type: "PlaylistCreateModal";
      props: PlaylistCreateModalProps;
    }
  | {
      type: "PlaylistViewModal";
      props: PlaylistViewModalProps;
    }
  | {
      type: "PlaylistUpdateVideosModal";
      props: PlaylistUpdateVideosModalProps;
    }
  | {
      type: "PlaylistEditModal";
      props: PlaylistEditModalProps;
    }
  | {
      type: "ConversationCreateModal";
      props: ConversationCreateModalProps;
    }
  | {
      type: "SignInModal";
      props: SignInModalProps;
    }
  | {
      type: "MagicLinkVerificationModal";
      props: MagicLinkVerificationModalProps;
    }
  | {
      type: "StreamCreateModal";
      props: StreamCreateModalProps;
    }
  | {
      type: "StreamKeyModal";
      props: StreamKeyModalProps;
    }
  | {
      type: "StreamSettingsModal";
      props: StreamSettingsModalProps;
    }
  | {
      type: "GoLiveModal";
      props: GoLiveModalProps;
    }
  | {
      type: "FollowersModal";
      props: FollowersModalProps;
    }
  | {
      type: "FollowingModal";
      props: FollowingModalProps;
    };

export const ModalsProvider = ({ children }: PropsWithChildren<object>) => (
  <ModalCenterProvider config={modalsConfig}>
    {children}
    <ModalCenter ignoreIds={[config.misc.notificationCenterId, "123"]} />
  </ModalCenterProvider>
);
