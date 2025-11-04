import { useEffect, RefObject } from "react";

export const useOutsideAction = (
  ref: RefObject<HTMLElement>,
  handler: any,
  ignoredAttributes: string[] = [],
) => {
  useEffect(() => {
    const clickListener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as any;

      if (ref && !ref.current?.contains?.(target as Node)) {
        let target = event.target as any;

        if (target.className.includes('overscroll-y-none')) {
          return;
        }

        while (target) {
          if (
            target.getAttribute &&
            ignoredAttributes.some((attr) => target.getAttribute(attr) !== null)
          ) {
            return;
          }

          target = target.parentElement;
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
  }, [ref, handler]);
};
