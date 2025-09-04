import {UserProfile} from "@/components/ui/user-profile";
import {CloseButton} from "@/components/ui/close-button";

export const ReplyToComment = ({ comment, onClose }: { comment: CommentPost; onClose?: () => void; }) => {
  return <div className="flex w-full border-t bg-base-300 px-4 py-2 items-center justify-between">
    <div className="flex items-center gap-2">
      <UserProfile user={{
          fbId: comment.created_by._id,
          username: comment.created_by.username,
          userimage: comment.created_by.userimage,
        }}
        withoutUsername
      />
      <p>Replying to: <span className="text-white">{comment.created_by.username}</span></p>
    </div>
    <CloseButton onClick={onClose} />
  </div>
}