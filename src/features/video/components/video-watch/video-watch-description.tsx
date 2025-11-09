import { useEffect, useRef, useState } from "react";

export const VideoWatchDescription = ({
  videoPost,
}: {
  videoPost: VideoPost;
}) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [showCollapseButton, setShowCollapseButton] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.scrollHeight;
      setShowCollapseButton(height > 100);
    }
  }, [videoPost.description]);

  if (!videoPost.description) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isDescriptionCollapsed && showCollapseButton
            ? "max-h-[100px]"
            : "max-h-none"
          }`}
      >
        <p ref={descriptionRef} className="whitespace-pre-wrap text-wrap">
          {videoPost.description}
        </p>
        {isDescriptionCollapsed && showCollapseButton && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none
              bg-gradient-to-b from-transparent to-[#111111]"
          />
        )}
      </div>
      {showCollapseButton && (
        <button
          onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
          className="flex items-center gap-1 text-sm text-base-700
            cursor-pointer hover:text-white transition-colors mt-1"
        >
          {isDescriptionCollapsed ? "Show more" : "Show less"}
          <svg
            className={`w-4 h-4 transition-transform ${
              isDescriptionCollapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
