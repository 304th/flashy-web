import { AccountLogin } from "@/features/auth/components/account-login/account-login";

export const Header = () => {
  return (
    <div
      className="flex bg-base-200 border-b border-b-base-300 w-full px-6 py-0
        h-16 items-center justify-between"
    >
      <img src="/logo.svg" alt="Logo" height={36} width={90} />
      <AccountLogin />
    </div>
  );
};
