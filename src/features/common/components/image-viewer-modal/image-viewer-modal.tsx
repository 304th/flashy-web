import React, { useState } from "react";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

type Slide = {
  src: string;
};

export interface ImageViewerModalProps {
  onClose(): void;
  slides: Slide[];
  initialOpenIndex?: number;
}

export const ImageViewerModal = ({
  onClose,
  slides,
  initialOpenIndex = 0,
}: ImageViewerModalProps) => {
  const [index, setIndex] = useState(initialOpenIndex);

  return (
    <Lightbox
      open={true}
      close={onClose}
      slides={slides}
      index={index}
      on={{
        view: ({ index: nextIndex }) => setIndex(nextIndex),
      }}
      animation={{
        /* start immediate closing (controlled by modal center) */
        fade: 0,
      }}
      /* https://github.com/igordanchenko/yet-another-react-lightbox/issues/375 */
      noScroll={{ disabled: true }}
    />
  );
};
