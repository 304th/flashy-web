export const StreamWatchOffline = ({
  stream,
  className,
}: {
  stream: Stream;
  className?: string;
}) => {
  return (
    <div
      style={{
        aspectRatio: "16/9",
        background: "url(/images/offline-stream.jpg)",
      }}
      className={`flex justify-center items-center w-full overflow-hidden
        rounded-md ${className}`}
    >
      <div
        className="flex items-center justify-center absolute inset-0 z-1
          backdrop-blur-2xl overflow-hidden rounded-md brightness-40"
      />
      <div>
        <p className="relative z-2 text-white text-3xl font-bold">
          {stream.status === "ended"
            ? "Stream Ended"
            : stream.status === "upcoming" || stream.status === "scheduled"
              ? "Stream starting soon"
              : ""}
        </p>
      </div>
    </div>
  );
};
