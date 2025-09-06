import { api } from "@/services/api";

export const getLinksPreview = async (links: string[]) => {
  return await api
    .post("links-preview", {
      json: {
        links,
      },
    })
    .json<LinkPreview[]>();
};
