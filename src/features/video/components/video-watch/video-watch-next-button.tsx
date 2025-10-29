import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const VideoWatchNextButton = forwardRef(
  ({ onNext }: { onNext: () => void }, ref) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(-1);

    useImperativeHandle(ref, () => ({
      show: (secondsTillNext: number) => setSecondsLeft(secondsTillNext),
      hide: () => setSecondsLeft(0),
    }));

    useEffect(() => {
      let id: any;
      if (secondsLeft > 0) {
        id = setTimeout(() => {
          setSecondsLeft((state) => state - 1);
        }, 1000);
      }

      return () => {
        clearTimeout(id);
      };
    }, [secondsLeft]);

    useEffect(() => {
      if (secondsLeft === 0) {
        onNext();
      }
    }, [secondsLeft]);

    if (secondsLeft <= 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 1 }}
        className="absolute bottom-14 right-3 z-50"
      >
        <div
          className="flex flex-col items-start gap-2 bg-base-200/90
            backdrop-blur-md p-3 rounded-md border border-base-300 shadow-lg
            min-w-[220px]"
        >
          <p className="text-white font-medium">Next video in {secondsLeft}s</p>
          <div className="flex gap-2 mt-1">
            <Button onClick={onNext}>Next</Button>
            <Button variant="secondary" onClick={() => setSecondsLeft(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    );
  },
);

VideoWatchNextButton.displayName = "VideoWatchNextButton";
