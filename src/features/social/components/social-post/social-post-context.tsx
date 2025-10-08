import { useContext, createContext, type PropsWithChildren } from "react";

interface SocialPostContextType {
  onCommentsOpen?: (postId: string) => void;
  onShareOpen?: (socialPost: SocialPost) => void;
}

const SocialPostContext = createContext<SocialPostContextType>({});

export const useSocialPostContext = () => {
  const context = useContext(SocialPostContext);

  if (context === undefined) {
    throw new Error(
      "useSocialPostContext must be used within a SocialPostProvider",
    );
  }

  return context;
};

export const SocialPostProvider = ({
  onCommentsOpen,
  onShareOpen,
  children,
}: PropsWithChildren<SocialPostContextType>) => {
  return (
    <SocialPostContext.Provider
      value={{
        onCommentsOpen,
        onShareOpen,
      }}
    >
      {children}
    </SocialPostContext.Provider>
  );
};
