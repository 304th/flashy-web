import { MessageIcon } from "@/components/ui/icons/message";

export const CommentButton = ({ commentsCount }: { commentsCount: number }) => {
  return <div className="group flex rounded-md items-center gap-1 p-1 cursor-pointer transition hover:text-[#1d9bf0] hover:bg-[#1d9bf010]">
    <div className="relative flex rounded-full">
      <MessageIcon />
    </div>
    <p className="transition">{commentsCount}</p>
  </div>
}