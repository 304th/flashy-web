export class Collection<Entity, Params = undefined> {
  constructor(
    private readonly schema: StaticSchema<Entity>,
    private readonly read: (params?: Params) => Promise<Entity[]>,
  ) {}

  getId(): keyof Entity {
    return this.schema.getId();
  }

  async readData(params?: Params) {
    return this.read(params);
  }

  createItem(entity?: Partial<Entity>) {
    return this.schema.createEntityFromParams(entity);
  }
}

export const createCollection = <Entity, Params>({
  sourceFrom,
  schema,
}: {
  sourceFrom: (params?: Params) => Promise<Entity[]>;
  schema: StaticSchema<Entity>;
}): Collection<Entity, Params> => {
  return new Collection<Entity, Params>(schema, sourceFrom);
};
