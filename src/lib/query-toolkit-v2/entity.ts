export class Entity<Item, Params = never> {
  constructor(
    private readonly read: (params?: Params) => Promise<Item>,
    private readonly name: string,
  ) {}

  async readData(params?: Params) {
    return this.read(params);
  }

  getName(): string {
    return this.name;
  }
}

export const createEntity = <Item, Params = never>({
  sourceFrom,
  name,
}: {
  sourceFrom: (params?: Params) => Promise<Item>;
  name: string;
}): Entity<Item, Params> => {
  return new Entity<Item, Params>(sourceFrom, name);
};
