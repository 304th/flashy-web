export const formatVideoDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h${minutes.toString().padStart(2, "0")}m`;
  } else {
    return `${minutes}m${remainingSeconds.toString().padStart(2, "0")}s`;
  }
};
