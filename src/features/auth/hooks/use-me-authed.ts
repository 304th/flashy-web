import { useEffect } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useMeAuthed = (callback: () => void) => {
  const { data: me } = useMe();

  useEffect(() => {
    if (me) {
      callback();
    }
  }, [me]);
};
