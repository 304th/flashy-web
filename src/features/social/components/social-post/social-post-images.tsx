import Image from "next/image";
import type {CSSProperties, MouseEvent} from "react";

import "yet-another-react-lightbox/styles.css";
import { useModals } from "@/hooks/use-modals";

export const SocialPostImages = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  const { openModal } = useModals();
  
  if (!socialPost.images || socialPost.images.length === 0) {
    return null;
  }

  const slides = socialPost.images.map((image) => ({ src: image }));

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

  const getImageStyles = (index: number, imageCount: number): CSSProperties => {
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

  const handleImageClick = (i: number, e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    openModal("ImageViewerModal", {
      slides,
      initialOpenIndex: i,
    });
  }

  return (
    <>
      <div className={`grid ${getGridLayout(socialPost.images.length)} mt-2`}>
        {socialPost.images.map((image, i) => (
          <div
            key={image}
            className={
              socialPost.images.length === 3 && i === 0
                ? "col-span-1 row-span-2 cursor-pointer"
                : "col-span-1 cursor-pointer"
            }
            onClick={(e) => handleImageClick(i, e)}
          >
            <Image
              src={image}
              alt={`Post image ${i + 1}`}
              width={500}
              height={0}
              style={getImageStyles(i, socialPost.images.length)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};
