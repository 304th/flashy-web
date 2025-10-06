import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useVideoSearch } from "@/features/video/queries/use-video-search";

export const VideoSearch = () => {
  const { data: videos, query } = useVideoSearch();

  return (
    <Loadable queries={[query as any]} fullScreenForDefaults>
      {() => {
        return videos!.length > 0 ? null : (
          <NotFound fullWidth>No videos found</NotFound>
        );
      }}
    </Loadable>
  );
};
