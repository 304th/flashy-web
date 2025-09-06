import Link from "next/link";
import replace from "react-string-replace";

export const SocialPostDescription = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  const description = useLinkify(socialPost.description);

  return <p className="text-lg whitespace-pre-wrap text-wrap">{description}</p>;
};

const useLinkify = (description: SocialPost["description"]) => {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

  return replace(description, urlRegex, (match, i) => (
    <Link
      key={`replaced-link-${i}`}
      href={match}
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {match}
    </Link>
  ));
};
