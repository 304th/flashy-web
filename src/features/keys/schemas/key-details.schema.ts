import { nanoid } from "nanoid";

class KeyDetailsSchema implements StaticSchema<KeyDetails> {
  getId(): keyof KeyDetails {
    return "_id";
  }

  createEntityFromParams(params: Partial<KeyDetails>): KeyDetails {
    return {
      _id: nanoid(),
      holders: 0,
      user: null,
      boughtBy: '',
      boughtPrice: '',
      buyPrice: 0,
      sellPrice: 0,
      lastPrice: null,
      ...params,
    };
  }
}

export const keyDetailsSchema = new KeyDetailsSchema();
