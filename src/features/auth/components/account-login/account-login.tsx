"use client";

import { useMe } from "@/features/auth/queries/use-me";
import { Loadable } from "@/components/ui/loadable";
import { NotLoggedIn } from "@/features/auth/components/account-login/not-logged-in";
import { LoggedIn } from "@/features/auth/components/account-login/logged-in";

export const AccountLogin = () => {
  const { data: me, query } = useMe();

  return (
    <Loadable queries={[query]}>
      {() => (me ? <LoggedIn /> : <NotLoggedIn />)}
    </Loadable>
  );
};
