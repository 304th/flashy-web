import { getMutation, handleMutationError } from "@/lib/query-toolkit-v2";
import { sendSignInLink } from "@/services/firebase";

interface SendLinkToEmailParams {
  email: string;
}

export const useSendLinkToEmail = () => {
  return getMutation<void, Error, SendLinkToEmailParams>(
    ["sendLinkToEmail"],
    async (params: SendLinkToEmailParams) => {
      return await sendSignInLink(params.email);
    },
    {
      onError: handleMutationError,
    },
  );
};
