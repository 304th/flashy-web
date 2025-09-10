import Image from "next/image";

export const SocialPostImages = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  if (socialPost.images?.length === 0) {
    return null;
  }

  return (
    <div className="flex overflow-hidden">
      {socialPost.images?.map((image) => (
        <Image
          key={image}
          src={image}
          alt="Post image"
          width={500} // Fixed width for consistency
          height={0} // Let height auto-adjust
          style={{ width: "100%", height: "auto" }} // Responsive
          sizes="(max-width: 768px) 100vw, 500px" // Responsive sizes
          className="rounded"
        />
      ))}
    </div>
  );
};
