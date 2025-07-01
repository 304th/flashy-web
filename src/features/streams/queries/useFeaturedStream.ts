import { useQuery } from "@tanstack/react-query";
//import { api } from "@/services/api";

export const useFeaturedStream = () => {
  const query = useQuery<any, any, Stream>({
    queryKey: ["streams", "featured"],
    queryFn: async () => {
      return {
        id: "685dbb6b208e2e5bde5b07b3",
        title: "StreamSavvy SnapShot",
        description:
          "Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
        thumbnail:
          "https://web-stories.s3.us-west-2.amazonaws.com/kl3m4e3mcd77uan/kl3/thumbnail_5ea0f92d-525e-4ae1-bafc-3bd02b0e900a.jpg",
        externalStreamId: "wbHEQACsA005kXkUINFuB3OduTNF88OE025BiqWxwz7AM",
        createdAt: "2025-06-26T21:28:11.758Z",
        updatedAt: "2025-07-01T12:29:02.252Z",
      };
    },
  });

  return [query.data, query] as const;
};
