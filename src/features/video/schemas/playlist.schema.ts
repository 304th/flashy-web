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
      publishedDate: Date.now().toString(),
      ...params,
    };
  }
}

export const playlistSchema = new PlaylistSchema();
