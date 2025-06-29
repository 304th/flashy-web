export const processStack = (state: any, action: any) => {
  return action.type
    ? action.options?.subModal
      ? [
          ...state.stack,
          { type: action.type, props: action.props, options: action.options },
        ]
      : [{ type: action.type, props: action.props, options: action.options }]
    : action.options?.closeAll
      ? []
      : state.stack.slice(0, state.stack.length - 1);
};
