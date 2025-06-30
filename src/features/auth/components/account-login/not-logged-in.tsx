import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";

export const NotLoggedIn = () => {
  const { openModal } = useModals();

  return (
    <motion.div
      className="flex gap-3 items-center"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
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
    </motion.div>
  );
};
