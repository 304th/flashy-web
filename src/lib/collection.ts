export class Collection<Entity, Params = undefined> {
  constructor(
    private readonly schema: StaticSchema<Entity>,
    private readonly read: (params?: Params) => Promise<Entity[]>,
  ) {}

  getSchema() {
    return this.schema;
  }

  async readData(params?: Params) {
    return this.read(params);
  }

  createItem(entity?: Partial<Entity>) {
    return this.schema.createEntityFromParams(entity);
  }
}

export const createCollection = <Entity, Params>({
  getData,
  schema,
}: {
  getData: (params?: Params) => Promise<Entity[]>;
  schema: StaticSchema<Entity>;
}): Collection<Entity, Params> => {
  return new Collection<Entity, Params>(schema, getData);
};
