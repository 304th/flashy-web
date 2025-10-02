import Image from "next/image";

export const SocialPostImages = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  if (!socialPost.images || socialPost.images.length === 0) {
    return null;
  }

  const getGridLayout = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2 gap-2";
      case 3:
        return "grid-cols-2 gap-2";
      case 4:
        return "grid-cols-2 gap-2";
      default:
        return "grid-cols-2 md:grid-cols-3 gap-2";
    }
  };

  const getImageStyles = (index: number, imageCount: number) => {
    if (imageCount === 1) {
      return { width: "100%", height: "auto", maxHeight: "500px" };
    }
    if (imageCount === 2) {
      return { width: "100%", height: "300px", objectFit: "cover" };
    }
    if (imageCount === 3) {
      if (index === 0) {
        return {
          width: "100%",
          height: "400px",
          objectFit: "cover",
          gridRow: "span 2",
        };
      }
      return { width: "100%", height: "200px", objectFit: "cover" };
    }
    if (imageCount === 4) {
      return { width: "100%", height: "200px", objectFit: "cover" };
    }

    return { width: "100%", height: "200px", objectFit: "cover" };
  };

  return (
    <div className={`grid ${getGridLayout(socialPost.images.length)} mt-2`}>
      {socialPost.images.map((image, index) => (
        <div
          key={image}
          className={
            socialPost.images.length === 3 && index === 0
              ? "col-span-1 row-span-2"
              : "col-span-1"
          }
        >
          <Image
            src={image}
            alt={`Post image ${index + 1}`}
            width={500}
            height={0}
            style={getImageStyles(index, socialPost.images.length)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded object-cover"
          />
        </div>
      ))}
    </div>
  );
};
