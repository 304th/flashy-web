import Image from "next/image";
import {useMemo} from "react";

export const PostLinkPreview = ({
  linkPreview,
}: {
  linkPreview: LinkPreview;
}) => {
  return (
    <div
      className="flex gap-4 bg-base-300 rounded-md border overflow-hidden
        transition hover:bg-base-400"
    >
      {(() => {
        switch (linkPreview.mediaType) {
          case "article":
            return <ArticlePreview linkPreview={linkPreview} />;
          case "website":
          default:
            return <WebsitePreview linkPreview={linkPreview} />;
        }
      })()}
    </div>
  );
};

const WebsitePreview = ({ linkPreview }: { linkPreview: LinkPreview }) => {
  const domainName = useMemo(() => linkPreview.url.replace(/^https?:\/\//, '').replace(/\/$/, ''), [linkPreview.url]);

  return (
    <>
      <div
        className="flex w-[40%] h-full bg-cover bg-center aspect-square"
        style={{ backgroundImage: `url(${linkPreview.images[0] || '/images/placeholder.png'})` }}
      />
      <div className="flex flex-col w-full p-3">
        <p>{domainName}</p>
        <p className="text-white font-bold">{linkPreview.title}</p>
        <p className="text-sm">{linkPreview.description}</p>
      </div>
    </>
  );
};

const ArticlePreview = ({ linkPreview }: { linkPreview: LinkPreview }) => {
  return (
    <>
      <div
        className="relative flex h-[260px] w-full bg-contain bg-center"
        style={{ backgroundImage: `url(${linkPreview.images[0]})` }}
      >
        <div
          className="absolute left-1 bottom-1 flex bg-[#111111aa] rounded-md
            p-1"
        >
          <p className="text-white">{linkPreview.title}</p>
        </div>
      </div>
    </>
  );
};
