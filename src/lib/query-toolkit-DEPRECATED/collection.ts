export class Collection<Entity, Params = never> {
  constructor(
    private readonly schema: StaticSchema<Entity>,
    private readonly read: (params: Params) => Promise<Entity[]>,
  ) {}

  getEntityId(entity: Entity): string {
    return entity[this.schema.getId()] as string;
  }

  async readData(params: Params) {
    return this.read(params);
  }

  createItem(entity?: Partial<Entity>) {
    return this.schema.createEntityFromParams(entity);
  }
}

export const createCollection = <Entity, Params = never>({
  sourceFrom,
  schema,
}: {
  sourceFrom: (params: Params) => Promise<Entity[]>;
  schema: StaticSchema<Entity>;
}): Collection<Entity, Params> => {
  return new Collection<Entity, Params>(schema, sourceFrom);
};
