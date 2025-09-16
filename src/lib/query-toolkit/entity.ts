export class Entity<Item, Params = undefined> {
  constructor(
    private readonly read: (params?: Params) => Promise<Item>,
  ) {}

  async readData(params?: Params) {
    return this.read(params);
  }
}

export const createEntity = <Item, Params = undefined>({
  sourceFrom,
}: {
  sourceFrom: (params?: Params) => Promise<Item>;
}): Entity<Item, Params> => {
  return new Entity<Item, Params>(sourceFrom);
};
