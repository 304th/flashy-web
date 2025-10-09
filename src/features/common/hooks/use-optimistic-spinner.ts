import { useEffect, useState } from "react";

export const useOptimisticSpinner = (entity: Optimistic<unknown>) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    let id: any;

    if (entity._optimisticStatus === "pending") {
      id = setTimeout(() => {
        setShow(true);
      }, 600);
    }

    return () => {
      clearTimeout(id);
    };
  }, [entity]);

  return show;
};
