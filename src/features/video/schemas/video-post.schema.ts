import { nanoid } from "nanoid";

class VideoPostSchema implements StaticSchema<VideoPost> {
  getId(): keyof VideoPost {
    return "fbId";
  }

  createEntityFromParams(params: Partial<VideoPost>): VideoPost {
    const id = nanoid();

    return {
      _id: id,
      fbId: id,
      title: "",
      storyImage: "",
      videoId: "",
      videoDuration: 0,
      views: 0,
      price: 0,
      hostID: "",
      username: "",
      publishDate: Date.now(),
      createdAt: Date.now(),
      reactions: {},
      ...params,
    };
  }
}

export const videoPostSchema = new VideoPostSchema();
