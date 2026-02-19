"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface StreamKeyConfirmModalProps {
  streamKey: string;
  onConfirm(): void;
  onClose(): void;
}

const STORAGE_KEY = "flashy_stream_key_confirmed";

export const getConfirmedStreamKey = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
};

export const setConfirmedStreamKey = (streamKey: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, streamKey);
};

export const isStreamKeyConfirmed = (streamKey: string): boolean => {
  const confirmedKey = getConfirmedStreamKey();
  return confirmedKey === streamKey;
};

export const StreamKeyConfirmModal = ({
  streamKey,
  onConfirm,
  onClose,
}: StreamKeyConfirmModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    setConfirmedStreamKey(streamKey);
    onConfirm();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-4 gap-4 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">
              Content Rights Confirmation
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Before accessing your stream credentials, please review and
              confirm the following terms.
            </p>
          </div>
        </div>

        <div
          className="rounded-lg border border-yellow-500/30 bg-yellow-500/10
            p-4"
        >
          <p className="text-sm font-medium text-yellow-200 mb-3">
            From our{" "}
            <Link href="/terms" className="underline hover:text-yellow-100">
              Terms and Conditions
            </Link>
            :
          </p>
          <div className="text-xs text-yellow-100/90 space-y-3">
            <p>
              You may not upload, stream, broadcast, or share any content unless
              you have the legal right to do so.
            </p>
            <p>This includes, but is not limited to:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Music, audio, or sound recordings</li>
              <li>Videos, films, or clips</li>
              <li>Live broadcasts</li>
              <li>Images, artwork, or photographs</li>
              <li>Written works</li>
              <li>Any third-party intellectual property</li>
            </ul>
            <p>
              By posting or broadcasting content, you represent and warrant
              that:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>You own the content, or</li>
              <li>
                You have obtained all necessary rights, licenses, permissions,
                and consents required to broadcast, distribute, and monetize the
                content on Flashy Social
              </li>
            </ul>
            <p>Flashy Social does not permit:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Pirated content</li>
              <li>Unauthorized live streams</li>
              <li>
                Content that infringes copyrights, trademarks, or other
                intellectual property rights
              </li>
              <li>
                Content taken from third-party platforms where redistribution is
                prohibited
              </li>
            </ul>
            <p className="font-medium">
              Flashy reserves the right to remove content, suspend accounts, or
              terminate access if we believe content violates these
              requirements.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            I confirm that I own the rights to broadcast my content or have
            obtained all necessary permissions to do so.
          </span>
        </label>

        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isChecked}>
            Confirm & Continue
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset max-w-[550px] min-w-[500px] !bg-base-300
      !rounded-md max-sm:w-full shadow-2xl overflow-hidden !p-0
      ${props.className || ""}`}
  />
);
