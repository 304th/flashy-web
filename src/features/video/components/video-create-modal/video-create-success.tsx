import React from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { ShareIcon, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoSuccessIcon } from "@/components/ui/icons/video-success";
import { useModals } from "@/hooks/use-modals";

export const VideoCreateSuccess = ({ video }: { video: VideoPost }) => {
  const context = useFormContext();
  const title = context.watch("title");
  const { openModal } = useModals();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center p-4">
        <VideoSuccessIcon />
      </div>
      <div
        className="flex flex-col items-center gap-8 max-w-[500px] p-4
          text-center"
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-white">Great news!</p>
          <p className="text-lg">
            Your video <span className="text-white font-medium">{title}</span>{" "}
            has been successfully uploaded, what would you like to do next:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/video/post?id=${video._id}`}>
            <Button variant="secondary">
              <ViewIcon />
              Preview
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="w-fit"
            onClick={() =>
              openModal("ShareModal", {
                id: video?._id,
                type: "video",
              })
            }
          >
            <ShareIcon />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
