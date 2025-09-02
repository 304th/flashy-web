import { HeartIcon } from "@/components/ui/icons/heart";

export const LikeButton = ({ likesCount }: { likesCount: number }) => {
  return <div className="group flex items-center gap-1 p-1 rounded-md cursor-pointer transition hover:text-red-700 hover:bg-[#ff001110]">
    <div className="relative flex rounded-full">
      <HeartIcon />
    </div>
    <p className="transition">{likesCount}</p>
  </div>
}