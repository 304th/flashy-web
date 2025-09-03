import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";
import { sendSignInLink } from "@/services/firebase";

interface SignupWithEmailParams {
  username: string;
  email: string;
  password: string;
}

export const useSignupWithEmail = () => {
  return getMutation<User, Error, SignupWithEmailParams>(
    ["signupWithEmail"],
    async ({ email, password, username }: SignupWithEmailParams) => {
      // console.log({ username, email, password })
      // return await sendSignInLink(email);

      return await api
        .post("auth/register", {
          json: { email, password, username },
        })
        .json<any>();
    },
    {
      onError: handleMutationError,
    },
  );
};
