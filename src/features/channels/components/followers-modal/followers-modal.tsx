import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { InfiniteFeed } from "@/components/ui/infinite-feed";
import { UserProfile } from "@/components/ui/user-profile";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useChannelFollowers } from "@/features/channels/queries/use-channel-followers";
import {Loadable} from "@/components/ui/loadable";
import {NotFound} from "@/components/ui/not-found";

export interface FollowersModalProps {
  channelId: string;
  onClose(): void;
}

export const FollowersModal = ({
  channelId,
  onClose,
}: FollowersModalProps) => {
  const { data: followers, query } = useChannelFollowers({ channelId });

  return (
    <Modal onClose={onClose}>
      <div className="relative flex p-6 pb-4 border-b">
        <h2 className="text-xl font-bold text-white">Followers</h2>
        <div className="absolute right-4 top-4" onClick={onClose}>
          <CloseButton />
        </div>
      </div>
      <div className="flex flex-col w-full overflow-y-scroll max-h-[60vh] p-4 gap-2 disable-scroll-bar">
        <Loadable queries={[query] as any}>
          {() => {
            return followers && followers?.length > 0 ?
              followers.map((follower) => (
                <UserProfile
                  key={follower.fbId}
                  user={follower}
                  className="hover:bg-base-300 rounded-md p-2 cursor-pointer"
                />
              )) : <NotFound>No followers yet</NotFound>
          }}
        </Loadable>
        {/*{query.isLoading ? (*/}
        {/*  <div className="flex w-full justify-center py-8">*/}
        {/*    <Spinner />*/}
        {/*  </div>*/}
        {/*) : followers && followers.length > 0 ? (*/}
        {/*  <InfiniteFeed query={query}>*/}
        {/*    {followers.map((follower) => (*/}
        {/*      <UserProfile*/}
        {/*        key={follower.fbId}*/}
        {/*        user={follower}*/}
        {/*        className="hover:bg-base-300 rounded-md p-2 cursor-pointer"*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </InfiniteFeed>*/}
        {/*) : (*/}
        {/*  <div className="flex w-full justify-center py-8">*/}
        {/*    <p className="text-base-600">No followers yet</p>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[500px] overflow-hidden !bg-base-300 !rounded-md max-sm:w-full !p-0 ${props.className}`}
  />
);
