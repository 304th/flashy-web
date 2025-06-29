import { useEffect, RefObject } from "react";

export const useOutsideAction = (
  ref: RefObject<HTMLElement>,
  handler: any,
  ...additionalRefs: any[]
) => {
  useEffect(() => {
    const clickListener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (additionalRefs.length > 0) {
        const foundHit = [ref, ...additionalRefs].some((ref) => {
          if (
            ref &&
            (ref.current?.contains?.(target as Node) ||
              ref.contains?.(target as Node))
          ) {
            return true;
          }
        });

        if (foundHit) {
          return;
        }
      } else if (ref && ref.current?.contains?.(target as Node)) {
        return;
      }

      handler(event);
    };

    const keyDownListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handler(event);
      }
    };

    document.addEventListener("mousedown", clickListener);
    document.addEventListener("touchstart", clickListener);
    document.addEventListener("keydown", keyDownListener);

    return () => {
      document.removeEventListener("mousedown", clickListener);
      document.removeEventListener("touchstart", clickListener);
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [ref, handler, additionalRefs]);
};
