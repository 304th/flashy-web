import {UserProfile} from "@/components/ui/user-profile";
import {StreamPlayer} from "@/features/streams/components/stream-player/stream-player";

const MOCK_USER = {
  id: '123123123',
  name: 'root',
  avatar: '',
  verified: true,
}

export const FeaturedStream = ({ stream }: { stream: Stream }) => {
  return (
    <div className="flex items-center w-full">
      <div className="relative flex w-1/2 h-full bg-base-400 p-4">
        <div className="flex w-full h-full z-1 items-end">
          <div className="flex flex-col gap-[2px]">
            <UserProfile user={MOCK_USER} />
            <h2 className="text-white text-2xl font-extrabold">
              {stream.title}
            </h2>
            <p className="text-base">
              {stream.description}
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #11111100 0%, #11111180 50%, #111111ee 100%), url(${stream.thumbnail}) no-repeat`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      <div className="flex w-1/2 h-full bg-pink-500">
        <StreamPlayer />
      </div>
    </div>
  );
};
