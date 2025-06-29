"use client";

import {
  useReducer,
  createContext,
  PropsWithChildren,
  FunctionComponent,
} from "react";
import { Variants } from "framer-motion";
import { processStack } from "@/packages/modals/utils/processStack";

export enum ModalComponentPosition {
  CENTER = "CENTER",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  BOTTOM_SHEET = "BOTTOM_SHEET",
  TOP_SHEET = "TOP_SHEET",
  CUSTOM = "CUSTOM",
}

interface ModalCenterStateDefaultOptions {
  position?:
    | ModalComponentPosition.CENTER
    | ModalComponentPosition.RIGHT
    | ModalComponentPosition.LEFT
    | ModalComponentPosition.BOTTOM_SHEET
    | ModalComponentPosition.TOP_SHEET;
  locked?: boolean;
  lightbox?: boolean;
  animations?: never;
  subModal?: boolean;
  key?: string;
  closeAll?: boolean;
  lockDragMobile?: boolean;
}

interface ModalCenterStateCustomOptions {
  position?: ModalComponentPosition.CUSTOM;
  locked?: boolean;
  lightbox?: boolean;
  animations?: {
    initial: any;
    variants: Variants;
  };
  subModal?: boolean;
  key?: string;
  lockDragMobile?: boolean;
}

export type ModalCenterStateOptions =
  | ModalCenterStateDefaultOptions
  | ModalCenterStateCustomOptions;

export interface ModalStackItem {
  type: string;
  props: Record<string, any>;
  options: ModalCenterStateOptions;
  Component?: any;
}

export interface ModalCenterState {
  type: string | null;
  props: Record<string, any>;
  options: ModalCenterStateOptions;
  stack: ModalStackItem[];
}

export type ModalCenterAction = (
  action: Partial<ModalCenterState>,
) => ModalCenterState;

export const ModalValueContext = createContext<ModalCenterState>(null as any);
export const ModalDispatchContext = createContext<ModalCenterAction>(
  null as any,
);
export const ModalRegistryContext = createContext<
  Record<string, FunctionComponent<{ onClose(): void }>>
>(null as any);

export interface ModalCenterProviderProps {
  config: Record<string, FunctionComponent<{ onClose(): void } & any>>;
}

export const ModalCenterProvider = ({
  config,
  children,
}: PropsWithChildren<ModalCenterProviderProps>) => {
  const [value, dispatch] = useReducer<ModalCenterState, any>(
    reducer as any,
    getInitialState(),
  );

  return (
    <ModalRegistryContext.Provider value={config}>
      <ModalDispatchContext.Provider value={dispatch as any}>
        <ModalValueContext.Provider value={value}>
          {children}
        </ModalValueContext.Provider>
      </ModalDispatchContext.Provider>
    </ModalRegistryContext.Provider>
  );
};

const getInitialState = (): ModalCenterState => ({
  type: null,
  props: {},
  options: {
    position: ModalComponentPosition.CENTER,
    locked: true,
  },
  stack: [],
});

const reducer = (
  state: ModalCenterState,
  action: Partial<ModalCenterState>,
) => {
  return {
    ...state,
    type: action.type,
    props: action.props || {},
    options: action.options || {},
    stack: processStack(state, action),
  };
};
