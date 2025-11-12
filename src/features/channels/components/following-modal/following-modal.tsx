import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { InfiniteFeed } from "@/components/ui/infinite-feed";
import { UserProfile } from "@/components/ui/user-profile";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useChannelFollowings } from "@/features/channels/queries/use-channel-followings";

export interface FollowingModalProps {
  channelId: string;
  onClose(): void;
}

export const FollowingModal = ({
  channelId,
  onClose,
}: FollowingModalProps) => {
  const { data: followings, query } = useChannelFollowings({ channelId });

  return (
    <Modal onClose={onClose}>
      <div className="relative flex p-6 pb-4 border-b border-base-300">
        <h2 className="text-xl font-bold text-white">Following</h2>
        <div className="absolute right-4 top-4" onClick={onClose}>
          <CloseButton />
        </div>
      </div>
      <div className="flex flex-col w-full overflow-y-scroll max-h-[60vh] p-4 gap-2 disable-scroll-bar">
        {query.isLoading ? (
          <div className="flex w-full justify-center py-8">
            <Spinner />
          </div>
        ) : followings && followings.length > 0 ? (
          <InfiniteFeed query={query}>
            {followings.map((following) => (
              <UserProfile
                key={following.fbId}
                user={following}
                className="hover:bg-base-300 rounded-md p-2 cursor-pointer"
              />
            ))}
          </InfiniteFeed>
        ) : (
          <div className="flex w-full justify-center py-8">
            <p className="text-base-600">Not following anyone yet</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[500px] overflow-hidden !bg-base-200 !rounded-md max-sm:w-full ${props.className}`}
  />
);
