import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Lottie from "lottie-react";
import { VideoUpload as VideoUploadInput } from "@/components/ui/video-upload";
import { Button } from "@/components/ui/button";
import { useCreateVideoOptions } from "@/features/video/mutations/use-create-video-options";
import { useUploadVideo } from "@/features/video/mutations/use-upload-video";
import { getVideoDuration } from "@/features/video/utils/get-video-duration";
import uploadPendingAnimation from "@/features/video/assets/upload-pending.json";

export const VideoFormUpload = ({ onClose }: { onClose: () => void }) => {
  const context = useFormContext();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const createVideoOptions = useCreateVideoOptions();
  const uploadVideo = useUploadVideo({
    onProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const isUploading = createVideoOptions.isPending || uploadVideo.isPending;
  const isProcessing = isUploading && uploadProgress === 100;

  return (
    <div className="relative flex flex-col">

      <div
        className="relative flex w-[75vw] max-w-[800px] max-h-[75vh] aspect-video
          mx-auto"
      >
        <VideoUploadInput
          className="w-full h-full rounded-none border-none hover:bg-base-100"
          description="Upload Video"
          uploading={isUploading}
          onChange={(uploadedFile) => setFile(uploadedFile)}
          onError={(msg) => console.error(msg)}
        />
        {
          (isUploading || isProcessing) && (
            <div className="absolute inset-0 flex items-center justify-center z-1">
              <div className="flex justify-center items-center rounded-full p-4 backdrop-grayscale-100 bg-white/10">
                <Lottie
                  animationData={uploadPendingAnimation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
              </div>
            </div>
          )
        }
      </div>
      <div className="flex w-full justify-end gap-2 p-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!file || isUploading}
          className={`min-w-[100px] ${
            isUploading
              ? isProcessing
                ? `text-white! bg-[#1d6cff40]! border-none! wave-animation
                  uploading-gradient`
                : `text-white! bg-brand-100-alpha! border-none! wave-animation
                  uploading-gradient`
              : ""
            }`}
          onClick={async () => {
            const uploadOptions =
              await createVideoOptions.mutateAsync(undefined); //FIXME: see why undefined is needed at all
            const video = await uploadVideo.mutateAsync({
              uploadToken: uploadOptions.token.token,
              file: file!,
              videoId: uploadOptions.video.videoId,
            });

            context.setValue("videoId", video.videoId, {
              shouldDirty: true,
              shouldValidate: true,
            });
            context.setValue("title", file?.name, {
              shouldDirty: true,
              shouldValidate: true,
            });

            context.setValue("videoDuration", await getVideoDuration(file!));
          }}
        >
          {isUploading
            ? isProcessing
              ? "Processing..."
              : `${uploadProgress}%`
            : "Upload"}
        </Button>
      </div>
      <LoadingStrip percentage={uploadProgress} />
    </div>
  );
};

const LoadingStrip = ({ percentage }: { percentage: number }) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const isProcessing = clampedPercentage === 100;

  return (
    <div className="absolute bottom-0 w-full">
      <div className="relative h-[4px] rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-brand-200 transition-all duration-300
            ease-in-out wave-animation uploading-gradient"
          style={{
            width: `${clampedPercentage}%`,
            ...(isProcessing ? { backgroundColor: "#1d6cff" } : {}),
          }}
        />
      </div>
    </div>
  );
};
