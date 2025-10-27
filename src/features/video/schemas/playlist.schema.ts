import { nanoid } from "nanoid";

class PlaylistSchema implements StaticSchema<Playlist> {
  getId(): keyof Playlist {
    return "fbId";
  }

  createEntityFromParams(params: Partial<Playlist>): Playlist {
    const id = nanoid();

    return {
      _id: id,
      fbId: id,
      title: "",
      image: "",
      hostID: "",
      username: "",
      publishDate: Date.now(),
      createdAt: Date.now(),
      ...params,
    };
  }
}

export const playlistSchema = new PlaylistSchema();
