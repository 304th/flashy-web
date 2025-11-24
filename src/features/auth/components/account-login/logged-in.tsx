import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/features/auth/components/account-login/account-dropdown";
import { CreateDropdown } from "@/features/auth/components/account-login/create-dropdown";
import { BalanceButton } from "@/features/wallet/components/balance-button";
import { MessagesButton } from "@/features/auth/components/account-login/messages-button";
import { defaultVariants } from "@/lib/framer";
import { NotificationsButton } from "@/features/notifications/components/notifications-button/notifications-button";

export const LoggedIn = () => {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        className="relative top-[1px] flex items-center gap-2"
        initial="hidden"
        animate="show"
        variants={defaultVariants.container}
      >
        <motion.div variants={defaultVariants.child}>
          <MessagesButton />
        </motion.div>
        <motion.div variants={defaultVariants.child}>
          <NotificationsButton />
        </motion.div>
        <motion.div variants={defaultVariants.child}>
          <BalanceButton />
        </motion.div>
      </motion.div>
      <motion.div variants={defaultVariants.child}>
        <AccountDropdown />
      </motion.div>
    </div>
  );
};
