import { nanoid } from "nanoid";

class KeySchema implements StaticSchema<Key> {
  getId(): keyof Key {
    return "user";
  }

  createEntityFromParams(params: Partial<Key>): Key {
    return {
      user: nanoid(),
      boughtBy: nanoid(),
      boughtPrice: "0.0",
      ...params,
    };
  }
}

export const keySchema = new KeySchema();
