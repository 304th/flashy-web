"use client";

import Image from "next/image";
import {
  FileText,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

interface AgreementDeliverablesProps {
  files?: string[];
  links?: string[];
  note?: string;
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];

const getFileExtension = (url: string) => {
  const pathname = url.split("?")[0];
  const ext = pathname.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : "";
};

const getFileName = (url: string) => {
  const pathname = url.split("?")[0];
  return pathname.split("/").pop() || "File";
};

const isImageUrl = (url: string) => {
  const ext = getFileExtension(url);

  return IMAGE_EXTENSIONS.includes(ext);
};

const isVideoUrl = (url: string) => {
  const ext = getFileExtension(url);
  return VIDEO_EXTENSIONS.includes(`.${ext}`);
};

export function AgreementDeliverables({
  files = [],
  links = [],
  note,
}: AgreementDeliverablesProps) {
  const hasContent = files.length > 0 || links.length > 0 || note;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-base-700">
        <FileText className="w-12 h-12 mb-4 opacity-50" />
        <p>No deliverables submitted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Submitted Files</h3>
          <div className="grid grid-cols-4 gap-2 max-w-2xl">
            {files.map((fileUrl, index) => (
              <button
                key={index}
                className="relative rounded-lg overflow-hidden bg-base-300 cursor-pointer hover:opacity-80 transition-opacity p-4 aspect-square"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                {isImageUrl(fileUrl) ? (
                  <Image
                    src={fileUrl}
                    alt={getFileName(fileUrl)}
                    fill
                    className="object-contain"
                  />
                ) : isVideoUrl(fileUrl) ? (
                  <video
                    src={fileUrl}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <FileText className="w-16 h-16 text-base-700 mb-1" />
                    <span className="text-base-700 text-[10px] truncate w-full text-center">
                      {getFileName(fileUrl)}
                    </span>
                    <span className="text-base-600 text-[10px] uppercase">
                      {getFileExtension(fileUrl)}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Submitted Links</h3>
          <div className="space-y-2">
            {links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-base-300 rounded-lg hover:bg-base-400 transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-base-400 rounded">
                  <LinkIcon className="w-5 h-5 text-base-700" />
                </div>
                <span className="flex-1 text-sm text-brand-100 truncate">
                  {link}
                </span>
                <ExternalLink className="w-4 h-4 text-base-700 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      )}

      {note && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Note from Creator</h3>
          <p className="text-sm text-base-800 bg-base-300 p-3 rounded-lg">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
