import { centerCrop, makeAspectCrop } from "react-image-crop";

export const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
};

export const completeCrop = ({ imageRef, crop, onCrop }: any) => {
  const _maxW = 0;
  const _maxH = 0;

  if (imageRef.current && crop.width && crop.height) {
    const scaleX = imageRef.current.naturalWidth / 100;
    const scaleY = imageRef.current.naturalHeight / 100;
    const width = Math.ceil(
      crop.width || scaleX < _maxW ? crop.width * scaleX : _maxW,
    );
    const height = Math.ceil(
      crop.height || scaleY < _maxH ? crop.height * scaleY : _maxH,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx?.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      onCrop(blob);
    }, "image/jpeg");
  }
};
