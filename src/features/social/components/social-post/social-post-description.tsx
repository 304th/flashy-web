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
  const description = useLinkify(socialPost.description);
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
};

const useLinkify = (description: SocialPost["description"]) => {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

  return replace(description, urlRegex, (match, i) => (
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
};
