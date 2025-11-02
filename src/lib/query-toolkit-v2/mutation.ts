export class Mutation<Params = undefined, Response = undefined> {
  constructor(
    private readonly writeData: (params: Params) => Promise<Response>,
    public readonly key?: string,
  ) {}

  async write(params: Params) {
    return this.writeData(params);
  }
}

export const createMutation = <Params = undefined, Response = unknown>({
  write,
  key,
}: {
  write: (params: Params) => Promise<Response>;
  key?: string;
}): Mutation<Params, Response> => {
  return new Mutation<Params, Response>(write, key);
};
