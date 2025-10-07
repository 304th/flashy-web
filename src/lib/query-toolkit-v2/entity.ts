export class Entity<Item, Params = undefined> {
  constructor(
    private readonly read: (params?: Params) => Promise<Item>,
    private readonly name?: string,
  ) {}

  async readData(params?: Params) {
    return this.read(params);
  }

  getName(): string {
    return this.name ?? "entity";
  }
}

export const createEntity = <Item, Params = undefined>({
  sourceFrom,
  name,
}: {
  sourceFrom: (params?: Params) => Promise<Item>;
  name?: string;
}): Entity<Item, Params> => {
  return new Entity<Item, Params>(sourceFrom, name);
};
