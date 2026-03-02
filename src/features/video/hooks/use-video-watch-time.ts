import { useCallback, useEffect, useRef } from "react";
import { useTrackWatchTime } from "@/features/gamification/mutations/use-track-watch-time";

export const useVideoWatchTime = () => {
  const playStartRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef(0);
  const trackWatchTime = useTrackWatchTime();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const report = useCallback(() => {
    if (playStartRef.current) {
      accumulatedSecondsRef.current +=
        (Date.now() - playStartRef.current) / 1000;
      playStartRef.current = null;
    }

    const minutes = accumulatedSecondsRef.current / 60;
    if (minutes >= 0.5) {
      trackWatchTime.mutate({
        minutes: Math.round(minutes * 10) / 10,
      });
      accumulatedSecondsRef.current = 0;
    }
  }, [trackWatchTime]);

  const onPlay = useCallback(() => {
    playStartRef.current = Date.now();

    if (!intervalRef.current) {
      intervalRef.current = setInterval(report, 5 * 60 * 1000);
    }
  }, [report]);

  const onPause = useCallback(() => {
    if (playStartRef.current) {
      accumulatedSecondsRef.current +=
        (Date.now() - playStartRef.current) / 1000;
      playStartRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onEnded = useCallback(() => {
    onPause();
    report();
  }, [onPause, report]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (playStartRef.current) {
        accumulatedSecondsRef.current +=
          (Date.now() - playStartRef.current) / 1000;
        playStartRef.current = null;
      }

      const minutes = accumulatedSecondsRef.current / 60;
      if (minutes >= 0.5) {
        trackWatchTime.mutate({
          minutes: Math.round(minutes * 10) / 10,
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { onPlay, onPause, onEnded };
};
