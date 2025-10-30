import { nanoid } from "nanoid";

class ChannelSchema implements StaticSchema<User> {
  getId(): keyof User {
    return "fbId";
  }

  createEntityFromParams(params: Partial<User>): User {
    const id = nanoid();

    return {
      fbId: id,
      email: "",
      username: "",
      userimage: "",
      verified: false,
      moderator: false,
      representative: false,
      superAdmin: false,
      ...params,
    };
  }
}

export const channelSchema = new ChannelSchema();
