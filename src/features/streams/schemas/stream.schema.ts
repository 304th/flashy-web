import { nanoid } from "nanoid";

class StreamSchema implements StaticSchema<Stream> {
  getId(): keyof Stream {
    return "id";
  }

  createEntityFromParams(params: Partial<Stream>): Stream {
    const id = nanoid();
    const now = new Date().toISOString();

    return {
      id,
      title: "",
      description: "",
      thumbnail: "",
      externalStreamId: "",
      userId: "",
      author: {
        fbId: "",
        username: "",
        userimage: "",
      },
      status: "scheduled",
      isLive: false,
      viewerCount: 0,
      chatEnabled: true,
      createdAt: now,
      updatedAt: now,
      ...params,
    };
  }
}

export const streamSchema = new StreamSchema();
