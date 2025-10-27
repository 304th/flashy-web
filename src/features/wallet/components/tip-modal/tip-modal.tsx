import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loadable } from "@/components/ui/loadable";
import { BlazeTipIcon } from "@/components/ui/icons/blaze-tip";
import { BlazeIcon } from "@/components/ui/icons/blaze";
import { AlertIcon } from "@/components/ui/icons/alert";
import { UserProfile } from "@/components/ui/user-profile";
import { useModals } from "@/hooks/use-modals";
import { useWalletBalance } from "@/features/wallet/queries/use-wallet-balance";
import { useTipChannel } from "@/features/wallet/mutations/use-tip-channel";

export interface TipModalProps {
  user: User;
  post: {
    type: string;
    id: string;
    title: string;
  };
  onClose(): void;
}

export const TipModal = ({ user, post, onClose, ...props }: TipModalProps) => {
  const { openModal } = useModals();
  const { data: balance, query: balanceQuery } = useWalletBalance();
  const tipChannel = useTipChannel();
  const [tipAmount, setTipAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = ["1", "5", "10", "25", "50", "100"];
  const hasEnoughBalance = Number(balance?.blaze || 0) >= Number(tipAmount || 0);
  const isValidAmount = tipAmount && Number(tipAmount) > 0;

  const handleAmountSelect = (amount: string) => {
    setTipAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    // Prevent negative values and minus signs
    if (value === "" || (!value.includes("-") && !isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setCustomAmount(value);
      setTipAmount(value);
    }
  };

  const handleTip = () => {
    if (!isValidAmount || !hasEnoughBalance) return;

    openModal(
      "ConfirmModal",
      {
        title: "Confirm Tip",
        description: `Are you ready to tip <span style="color: white;font-weight:bold">@${user.username}</span> <span style="color: white;font-weight:bold">${tipAmount} BLAZE</span> for "${post.title}"?`,
        actionTitle: "Send Tip",
        onConfirm: () => {
          tipChannel.mutate(
            {
              channelId: user.fbId,
              amount: parseFloat(tipAmount),
              post: {
                type: post.type,
                id: post.id,
                title: post.title,
              },
            },
            {
              onSuccess: onClose,
            },
          );
        },
      },
      { subModal: true },
    );
  };

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center rounded-md w-full"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex w-full p-4">
            <div className="absolute right-2 top-2" onClick={onClose}>
              <CloseButton />
            </div>
            <div className="flex flex-col w-full justify-center">
              <p className="text-2xl font-extrabold text-white">Send Tip</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center w-full text-center">
            <BlazeTipIcon />
            <p>
              Show your appreciation by sending a tip to <span className="text-white font-bold">@{user.username}</span>
            </p>
            <div className="flex items-center gap-1 text-base-700">
              <AlertIcon />
              <p className="text-xs">Tips are sent instantly and cannot be refunded</p>
            </div>
          </div>
          <div className="flex w-full gap-2 justify-between border-y p-4">
            <UserProfile user={user} />
            <div className="flex items-center gap-2 text-white">
              <Loadable queries={[balanceQuery]}>
                {() => (
                  <div className="flex items-center gap-1">
                    {tipAmount || "0"}
                    <span className="text-sm">BLAZE</span>
                  </div>
                )}
              </Loadable>
              <BlazeIcon />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full p-4">
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold">Select Tip Amount</p>
              <div className="grid grid-cols-3 gap-2">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "secondary"}
                    className="!w-full"
                    onClick={() => handleAmountSelect(amount)}
                  >
                    {amount} BLAZE
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold">Custom Amount</p>
              <Input
                type="number"
                placeholder="Enter custom amount"
                min={0}
                value={customAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomAmountChange(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  // Prevent minus key, plus key, and 'e' key (scientific notation)
                  if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
                className="text-center"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-2 p-4 text-base-700">
          <Loadable queries={[balanceQuery]}>
            {() => {
              return hasEnoughBalance ? <div className="flex items-center gap-1 text-base-700">
                <AlertIcon />
                <p className="text-xs">
                  Your balance: {balance?.blaze || "0"} BLAZE
                </p>
              </div> : null
            }}
          </Loadable>
          {!hasEnoughBalance && tipAmount && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertIcon />
              <p className="text-xs">Not enough balance available.</p>
            </div>
          )}
          <Button
            disabled={!isValidAmount || !hasEnoughBalance}
            pending={tipChannel.isPending}
            onClick={handleTip}
            className="w-[120px]"
          >
            Send Tip
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset w-[500px] max-w-[550px] !bg-base-300 border-none
      !rounded-md max-max-sm:w-full overflow-hidden ${props.className}`}
  />
);
