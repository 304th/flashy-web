import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CarouselCardProps {
  playlist: Playlist;
  isActive: boolean;
}

export const CarouselCard = ({
  playlist,
  isActive,
  onClick,
}: CarouselCardProps & { onClick: () => void }) => {
  return (
    <div
      className={`relative flex-shrink-0 w-[450px] md:w-[600px] h-[280px]
        md:h-[340px] rounded-lg overflow-hidden cursor-pointer transition
        ${isActive ? "" : "opacity-70"}`}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={playlist.image || "/images/placeholder.png"}
          alt={playlist.title}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80
            via-black/10 to-transparent"
        />
      </div>
      <div
        className="absolute bottom-0 w-full flex justify-between items-center
          p-4 md:p-6"
      >
        <h3
          className="text-white text-2xl font-medium truncate max-w-[250px]
            md:max-w-[280px]"
        >
          {playlist.title}
        </h3>
        <div className="flex justify-end">
          <Link
            href={`/video/post?id=${playlist.order?.[0]}&playlistId=${playlist.fbId}`}
          >
            <Button>Watch Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
