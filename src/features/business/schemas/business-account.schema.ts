import { nanoid } from "nanoid";

class BusinessAccountSchema implements StaticSchema<BusinessAccount> {
  getId(): keyof BusinessAccount {
    return "_id";
  }

  createEntityFromParams(params: Partial<BusinessAccount>): BusinessAccount {
    const id = nanoid();

    return {
      _id: id,
      userId: "",
      title: "",
      description: "",
      category: "lifestyle",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const businessAccountSchema = new BusinessAccountSchema();
