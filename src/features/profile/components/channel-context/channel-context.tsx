import { useContext, createContext, type PropsWithChildren } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

interface ChannelContextType {
  channelId?: string;
  channel?: User;
  channelQuery: UseQueryResult<User>;
  stream?: Stream;
}

const ChannelContext = createContext<ChannelContextType>({} as any);

export const useChannelContext = () => {
  const context = useContext(ChannelContext);

  if (context === undefined) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }

  return context;
};

export const ChannelContextProvider = ({
  channelId,
  channel,
  channelQuery,
  stream,
  children,
}: PropsWithChildren<ChannelContextType>) => {
  return (
    <ChannelContext.Provider
      value={{
        channelId,
        channel,
        channelQuery,
        stream,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
