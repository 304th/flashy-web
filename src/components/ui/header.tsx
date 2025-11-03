import Link from "next/link";
import { AccountLogin } from "@/features/auth/components/account-login/account-login";
import { HeaderUserSearch } from "@/components/ui/header-user-search";

export const Header = () => {
  return (
    <div className="relative bg-base-200 border-b border-b-base-300 z-3">
      <div
        className="flex bg-base-200 border-b border-b-base-300 w-full px-5 py-0
          h-16 items-center justify-between max-w-content"
      >
        <Link href="/" className="inline-flex items-center p-1 rounded-md transition hover:bg-brand-100/10">
          <img src="/logo.svg" alt="Logo" height={36} width={90} />
          <img
            src="/app.svg"
            alt="App"
            height={36}
            width={90}
            className="relative scale-90 top-[1px]"
          />
        </Link>
        <div className="flex-1 mx-6 hidden md:flex justify-center">
          <HeaderUserSearch />
        </div>
        <AccountLogin />
      </div>
    </div>
  );
};
