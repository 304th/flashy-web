import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";
import { defaultVariants } from "@/lib/framer";

export const NotLoggedIn = () => {
  const { openModal } = useModals();

  return (
    <motion.div
      className="flex gap-3 items-center"
      initial="hidden"
      animate="show"
      variants={defaultVariants.container}
    >
      <Button
        className="min-w-[120px]"
        onClick={() => {
          openModal("SignInModal");
        }}
      >
        Sign In
      </Button>
      {/*<Button*/}
      {/*  variant="secondary"*/}
      {/*  className="min-w-[120px]"*/}
      {/*  onClick={() => {*/}
      {/*    openModal("LoginModal");*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Login*/}
      {/*</Button>*/}
    </motion.div>
  );
};
