import { nanoid } from "nanoid";

class VideoPostSchema implements StaticSchema<VideoPost> {
  getId(): keyof VideoPost {
    return "fbId";
  }

  createEntityFromParams(params: Partial<VideoPost>): VideoPost {
    const id = nanoid();

    return {
      fbId: id,
      title: "",
      storyImage: "",
      videoId: "",
      videoDuration: 1000,
      views: 0,
      price: 0,
      hostID: "",
      publishDate: new Date().toISOString(),
      username: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const videoPostSchema = new VideoPostSchema();
