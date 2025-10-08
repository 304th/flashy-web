import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query-toolkit-v2";

export interface PreRegisterEmailParams {
  email: string;
  password: string;
  captchaToken: string;
}

export const usePreRegisterEmail = () => {
  return getMutation(
    ["preRegisterEmail"],
    async (params: PreRegisterEmailParams) => {
      return api
        .post("auth/email/pre-register", {
          json: {
            email: params.email,
            password: params.password,
            captchaToken: params.captchaToken,
          },
        })
        .json<{ email: string; otp: string }>();
    },
    {
      onError: async (err: Error) => {
        await handleMutationError(err);
      },
    },
  );
};
