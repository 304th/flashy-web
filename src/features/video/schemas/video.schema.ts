import { nanoid } from "nanoid";

class VideoSchema implements StaticSchema<Video> {
  getId(): keyof Video {
    return "fbId";
  }

  createEntityFromParams(params: Partial<Video>): Video {
    const id = nanoid();

    return {
      fbId: id,
      title: "",
      storyImage: "",
      videoDuration: 1000,
      views: 0,
      price: 0,
      publishDate: new Date().toISOString(),
      username: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const videoSchema = new VideoSchema();
