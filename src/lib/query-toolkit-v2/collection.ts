export class Collection<Entity, Params = never> {
  constructor(
    private readonly schema: StaticSchema<Entity>,
    private readonly read: (params: Params) => Promise<Entity[]>,
    private readonly name: string,
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

  getName(): string {
    return this.name;
  }
}

export const createCollection = <Entity, Params = never>({
  sourceFrom,
  schema,
  name,
}: {
  sourceFrom: (params: Params) => Promise<Entity[]>;
  schema: StaticSchema<Entity>;
  name: string;
}): Collection<Entity, Params> => {
  return new Collection<Entity, Params>(schema, sourceFrom, name);
};
