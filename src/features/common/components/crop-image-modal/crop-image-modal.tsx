import "react-image-crop/dist/ReactCrop.css";
import React, { useEffect, useRef, useState, SyntheticEvent } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import {
  Modal as ModalComponent,
  ModalFooter,
  ModalFooterVariant,
  ModalHeader,
} from "@/packages/modals";
import { Button } from "@/components/ui/button";
import {
  centerAspectCrop,
  completeCrop,
} from "@/features/common/utils/image-crop";
import { useOutsideAction } from "@/hooks/use-outside-action";
import { motion } from "framer-motion";
import { CloseButton } from "@/components/ui/close-button";

const DEFAULT_CROP: Crop = { unit: "%", x: 0, y: 0, width: 100, height: 100 };

export interface ShareModalProps {
  file?: File;
  image?: string;
  aspectRatio?: number;
  isAvatar?: boolean;
  actionLabel?: string;
  onSuccess(result: any): void;
  onClose(): void;
}

export const CropImageModal = ({
  file,
  image = "",
  aspectRatio,
  isAvatar,
  actionLabel = "Crop",
  onSuccess,
  onClose,
  ...props
}: ShareModalProps) => {
  const ref = useRef<any>(null);
  const [pending, setPending] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(image);
  const [crop, setCrop] = useState<Crop | undefined>(() =>
    aspectRatio ? undefined : DEFAULT_CROP,
  );

  useEffect(() => {
    if (!imageSrc && file) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(file);
    }
  }, [file, imageSrc]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    } else if (isAvatar) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, 1));
    }
  };

  useOutsideAction(ref, onClose);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-6 gap-6 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Crop Image</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full flex-grow">
          {imageSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={isAvatar ? 1 : aspectRatio}
              circularCrop={isAvatar}
              keepSelection
            >
              <img
                ref={imageRef}
                alt="Crop me"
                src={imageSrc}
                className="max-h-[75vh] max-w-[75vh]"
                style={{ transform: `scale(${1}) rotate(0deg)` }}
                onLoad={handleImageLoad}
              />
            </ReactCrop>
          ) : null}
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Upload Image
          </Button>
        </div>
      </motion.div>
    </Modal>
  );

  // return (
  //   <div
  //     ref={ref}
  //     className="flex flex-col shadow-[0_10px_60px_0_rgba(0,0,0,0.3)] w-fit
  //       h-fit bg-[var(--body-background-color)]
  //       rounded-[var(--border-radius-md)] min-w-[500px] min-h-[500px] max-w-full
  //       sm:max-w-[calc(100vw-1rem)] sm:min-w-0"
  //     {...modalProps}
  //   >
  //     <ModalHeader onClose={onClose}>Crop Image</ModalHeader>
  //     <div className="flex items-center justify-center w-full flex-grow">
  //       {imageSrc ? (
  //         <ReactCrop
  //           crop={crop}
  //           onChange={(_, percentCrop) => setCrop(percentCrop)}
  //           aspect={isAvatar ? 1 : aspectRatio}
  //           circularCrop={isAvatar}
  //           keepSelection
  //         >
  //           <img
  //             ref={imageRef}
  //             alt="Crop me"
  //             src={imageSrc}
  //             className="max-h-[75vh] max-w-[75vh]"
  //             style={{ transform: `scale(${1}) rotate(0deg)` }}
  //             onLoad={handleImageLoad}
  //           />
  //         </ReactCrop>
  //       ) : null}
  //     </div>
  {
    /*<ModalFooter*/
  }
  {
    /*  variant={ModalFooterVariant.STRETCH}*/
  }
  {
    /*  className="w-full justify-end border-t border-[var(--selection-color)]*/
  }
  {
    /*    [&>div]:justify-end"*/
  }
  {
    /*>*/
  }
  {
    /*  <Button*/
  }
  {
    /*    disabled={!Boolean(crop)}*/
  }
  {
    /*    pending={pending}*/
  }
  {
    /*    onClick={() =>*/
  }
  {
    /*      completeCrop({*/
  }
  {
    /*        imageRef,*/
  }
  {
    /*        crop,*/
  }
  {
    /*        onCrop: async (blob: any) => {*/
  }
  {
    /*          setPending(true);*/
  }
  {
    /*          await onSuccess(blob);*/
  }
  {
    /*          setPending(false);*/
  }
  {
    /*          onClose();*/
  }
  {
    /*        },*/
  }
  {
    /*      })*/
  }
  {
    /*    }*/
  }
  {
    /*  >*/
  }
  {
    /*    {actionLabel}*/
  }
  {
    /*  </Button>*/
  }
  {
    /*</ModalFooter>*/
  }
  // </div>
  // );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[500px] !bg-base-300 !rounded-md
      max-sm:w-full overflow-hidden ${props.className}`}
  />
);
