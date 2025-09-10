// import "react-image-crop/dist/ReactCrop.css";
// import { useEffect, useRef, useState, SyntheticEvent } from "react";
// import ReactCrop, { Crop } from "react-image-crop";
// import { ModalHeader } from "@/packages/modals";
// import { Button } from "@/core/components/Button/Button";
// import {
//   centerAspectCrop,
//   completeCrop,
// } from "@/features/common/components/crop-image-modal/crop-image-modal.utils";
// import { useOutsideAction } from "@/core/hooks/useOutsideAction";
//
// const DEFAULT_CROP: Crop = { unit: "%", x: 0, y: 0, width: 100, height: 100 };
//
// export interface CropImageModalProps {
//   file?: File;
//   image?: string;
//   aspectRatio?: number;
//   isAvatar?: boolean;
//   actionLabel?: string;
//   onSuccess(result: any): void;
//   onClose(): void;
// }
//
// export const CropImageModal = ({
//   file,
//   image = "",
//   aspectRatio,
//   isAvatar,
//   onSuccess,
//   onClose,
// }: CropImageModalProps) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const imageRef = useRef<HTMLImageElement>(null);
//   const [imageSrc, setImageSrc] = useState<string>(image);
//   const [crop, setCrop] = useState<Crop | undefined>(() =>
//     aspectRatio ? undefined : DEFAULT_CROP,
//   );
//
//   useEffect(() => {
//     if (!imageSrc && file) {
//       const reader = new FileReader();
//       reader.addEventListener("load", () =>
//         setImageSrc(reader.result?.toString() || ""),
//       );
//       reader.readAsDataURL(file);
//     }
//   }, [file, imageSrc]);
//
//   const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
//     if (aspectRatio) {
//       const { width, height } = e.currentTarget;
//       setCrop(centerAspectCrop(width, height, aspectRatio));
//     } else if (isAvatar) {
//       const { width, height } = e.currentTarget;
//       setCrop(centerAspectCrop(width, height, 1));
//     }
//   };
//
//   useOutsideAction(ref as any, onClose);
//
//   return (
//     <div
//       ref={ref}
//       className="flex flex-col shadow-[0_10px_60px_rgba(0,0,0,0.3)] min-w-[500px] min-h-[500px]
//         bg-bg-weak-100 rounded-md sm:min-w-full sm:h-full"
//     >
//       <div className="flex-1 flex items-center justify-center">
//         {imageSrc ? (
//           <ReactCrop
//             crop={crop}
//             onChange={(_, percentCrop) => setCrop(percentCrop)}
//             aspect={isAvatar ? 1 : aspectRatio}
//             circularCrop={isAvatar}
//             keepSelection
//           >
//             <img
//               ref={imageRef}
//               alt="Crop me"
//               src={imageSrc}
//               style={{ transform: `scale(${1}) rotate(${0}deg)` }}
//               onLoad={handleImageLoad}
//             />
//           </ReactCrop>
//         ) : null}
//       </div>
//       <div className="flex w-full justify-end rounded-b-[12px] border-t bg-bg-white-0 py-4 px-5 gap-3">
//         <Button
//           variant="secondary"
//           mode="stroke"
//           onClick={onClose}
//           className="sm:w-full"
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={() =>
//             completeCrop({
//               imageRef,
//               crop,
//               onCrop: async (blob: any) => {
//                 void onSuccess(blob);
//                 onClose();
//               },
//             })
//           }
//           className="sm:w-full"
//         >
//           Crop
//         </Button>
//       </div>
//     </div>
//   );
// };
