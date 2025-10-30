import Link from "next/link";
import replace from "react-string-replace";
import { parseDomainName } from "@/lib/utils";
import { useParsedPostLinkPreviews } from "@/features/social/hooks/use-parsed-post-preview-links";
import { PostLinkPreview } from "@/features/social/components/post-link-preview/post-link-preview";

export const SocialPostDescription = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  const description = useLinkifyAndMention(
    socialPost.description,
    socialPost.mentionedUsers,
  );
  const [, linkPreviews] = useParsedPostLinkPreviews(socialPost.description);

  if (description) {
    return (
      <div className="flex flex-col gap-2">
        {description && (
          <p className="text-lg whitespace-pre-wrap text-wrap">{description}</p>
        )}
        {linkPreviews && (
          <div className="flex flex-col gap-2">
            {linkPreviews.map((linkPreview) => (
              <PostLinkPreview
                key={`link-preview-${linkPreview.url}`}
                linkPreview={linkPreview}
                linkable
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Enhanced: also links user mentions (e.g., @username)
const useLinkifyAndMention = (
  description: SocialPost["description"],
  mentionedUsers: Array<{ username: string; [k: string]: any }>,
) => {
  // 1. Replace URLs with links as before
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

  let replaced = replace(description, urlRegex, (match, i) => (
    <Link
      key={`replaced-link-${i}`}
      href={match}
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {parseDomainName(match as `http${string}`)}
    </Link>
  ));

  // 2. Replace @mentions with profile links, but only if the username is in mentionedUsers
  const mentionRegex = /@([a-zA-Z0-9_]{1,20})/g;
  // Create a Set for quick lookup
  const userSet = new Set(
    Array.isArray(mentionedUsers)
      ? mentionedUsers.map((u) => u.username?.toLowerCase()).filter(Boolean)
      : [],
  );

  replaced = replace(replaced, mentionRegex, (username, i) => {
    if (userSet.has(username.toLowerCase())) {
      return (
        <Link
          key={`mention-link-${username}-${i}`}
          href={`/channel/social?username=${username}`}
          className="text-blue-500 hover:underline font-medium"
        >
          @{username}
        </Link>
      );
    }

    return username;
  });

  return replaced;
};
