import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";

export const NotLoggedIn = () => {
  const { openModal } = useModals();

  return (
    <div className="flex gap-3 items-center">
      <Button
        className="min-w-[120px]"
        onClick={() => {
          openModal("SignupModal");
        }}
      >
        Sign Up
      </Button>
      <Button
        variant="secondary"
        className="min-w-[120px]"
        onClick={() => {
          openModal("LoginModal");
        }}
      >
        Login
      </Button>
    </div>
  );
};
