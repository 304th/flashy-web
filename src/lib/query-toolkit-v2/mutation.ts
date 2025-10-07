export class Mutation<Params = undefined, Response = undefined> {
  constructor(private readonly write: (params: Params) => Promise<Response>) {}

  async writeData(params: Params) {
    return this.write(params);
  }
}

export const createMutation = <Params = undefined, Response = unknown>({
  writeToSource,
}: {
  writeToSource: (params: Params) => Promise<Response>;
}): Mutation<Params, Response> => {
  return new Mutation<Params, Response>(writeToSource);
};
