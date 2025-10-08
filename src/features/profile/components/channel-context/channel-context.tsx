import { useContext, createContext, type PropsWithChildren } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { EntityOptimisticMutations } from "@/lib/query-toolkit-v2";
import { useChannelById } from "@/features/channels/queries/use-channel-by-id";

interface ChannelContextType {
  channelId: string;
  query: UseQueryResult<User>;
  optimisticUpdates: EntityOptimisticMutations<User>;
  channel?: User;
}

const ChannelContext = createContext<ChannelContextType>({} as any);

export const useChannelContext = () => {
  const context = useContext(ChannelContext);

  if (context === undefined) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }

  return context;
};

export const ChannelProvider = ({
  channelId,
  children,
}: PropsWithChildren<Pick<ChannelContextType, "channelId">>) => {
  const { data: channel, query, optimisticUpdates } = useChannelById(channelId);

  return (
    <ChannelContext.Provider
      value={{
        channelId,
        channel,
        query,
        optimisticUpdates,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
