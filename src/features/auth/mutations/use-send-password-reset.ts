import { getMutation } from "@/lib/query-toolkit-v2";
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
