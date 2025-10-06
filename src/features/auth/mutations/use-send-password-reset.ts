import { getMutation } from "@/lib/query-toolkit";
import { sendPasswordReset } from "@/services/firebase";

export interface SendPasswordResetParams {
  email: string;
}

export const useSendPasswordReset = () =>
  getMutation(
    ["sendPasswordReset"],
    async (params: SendPasswordResetParams) => {
      return sendPasswordReset(params.email);
    },
  );
