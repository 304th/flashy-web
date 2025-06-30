import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";

interface SignupWithEmailParams {
  username: string;
  email: string;
  password: string;
}

export const useSignupWithEmail = () => {
  return getMutation<LegacyMe, Error, SignupWithEmailParams>(
    ["signupWithEmail"],
    async ({ username, email, password }: SignupWithEmailParams) => {
      return await api
        .post("preRegister?isDigits=true", {
          body: JSON.stringify({ username, email, password }),
        })
        .json<any>();
    },
    {
      onError: handleMutationError,
    },
  );
};
