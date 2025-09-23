import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { KeyLockIcon } from "@/components/ui/icons/key-lock";
import { HelpIcon } from "@/components/ui/icons/help";
import { UserProfile } from "@/components/ui/user-profile";
import { useKeyPrice } from "@/features/keys/queries/useKeyPrice";
import { KeyIcon } from "@/components/ui/icons/key";
import { BlazeIcon } from "@/components/ui/icons/blaze";
import { AlertIcon } from "@/components/ui/icons/alert";

export interface BuyKeyModalProps {
  user: User;
  onClose(): void;
}

export const BuyKeyModal = ({ user, onClose, ...props }: BuyKeyModalProps) => {
  const { data: keyPrice, query: keyPriceQuery } = useKeyPrice(user.fbId);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center rounded-md"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full p-4">
            <div className="absolute right-2 top-2" onClick={onClose}>
              <CloseButton />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p className="text-2xl font-extrabold text-white">Buy Key</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center w-[80%] text-center">
            <KeyLockIcon />
            <p>
              Holding a key will unlock exclusive content & many more features
              in the future.
            </p>
            <div className="flex items-center gap-1 text-base-700">
              <HelpIcon />
              <p className="text-xs">You can buy & also sell keys</p>
            </div>
          </div>
          <div className="flex w-full gap-2 justify-between border-y p-4">
            <UserProfile user={user} />
            <div className="flex items-center gap-3 text-white">
              <KeyIcon />
              <p className="text-base-800">=</p>
              <Loadable queries={[keyPriceQuery]}>
                {() => (
                  <div className="flex items-center gap-1">
                    {keyPrice?.buyInBlaze.toFixed(2)}
                    <BlazeIcon />
                  </div>
                )}
              </Loadable>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-2 p-4 text-base-700">
          <div className="flex items-center gap-1 text-base-700">
            <AlertIcon />
            <p className="text-xs">
              a 10% fee will taken on top of the key price
            </p>
          </div>
          <Button
            onClick={() => {
              onClose();
            }}
            className="w-[120px]"
          >
            Buy
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset max-w-[500px] !bg-base-300 border-none
      !rounded-md sm:w-full overflow-hidden ${props.className}`}
  />
);
