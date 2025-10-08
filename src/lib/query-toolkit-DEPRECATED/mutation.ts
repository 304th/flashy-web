export class Mutation<Params = undefined, Response = undefined> {
  constructor(
    private readonly writeData: (params: Params) => Promise<Response>,
  ) {}

  async write(params: Params) {
    return this.writeData(params);
  }
}

export const createMutation = <Params = undefined, Response = unknown>({
  write,
}: {
  write: (params: Params) => Promise<Response>;
}): Mutation<Params, Response> => {
  return new Mutation<Params, Response>(write);
};
