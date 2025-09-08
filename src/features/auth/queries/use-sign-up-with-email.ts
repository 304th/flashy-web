import { useQueryClient } from "@tanstack/react-query";
import {getMutation, handleAuthSuccess, handleMutationError} from "@/lib/query";
import { api } from "@/services/api";
import { signInWithToken } from "@/services/firebase";

interface SignupWithEmailParams {
  email: string;
  otp: string;
}

export const useSignupWithEmail = () => {
  const queryClient = useQueryClient();

  return getMutation<void, Error, SignupWithEmailParams>(
    ["signupWithEmail"],
    async (params: SignupWithEmailParams) => {
      const data = await api.post('auth/email/register', {
        json: {
          email: params.email,
          otp: params.otp,
        }
      }).json<{ idToken: string }>()

      await signInWithToken(data.idToken);
    },
    {
      onError: handleMutationError,
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};


// import { getMutation, handleMutationError } from "@/lib/query";
// import { useVerifyCaptcha } from "@/features/auth/queries/use-verify-captcha";
// import { sendVerificationEmail, signUpUserWithEmail } from "@/services/firebase";
//
// interface SignupWithEmailParams {
//   email: string;
//   password: string;
//   captchaToken: string;
// }
//
// export const useSignupWithEmail = () => {
//   const verifyCaptcha = useVerifyCaptcha();
//
//   return getMutation<void, Error, SignupWithEmailParams>(
//     ["signupWithEmail"],
//     async (params: SignupWithEmailParams) => {
//       const captchaResponse = await verifyCaptcha.mutateAsync({
//         captchaToken: params.captchaToken,
//       });
//
//       if (!captchaResponse.success) {
//         throw new Error("Captcha verification failed");
//       }
//
//       try {
//         const userCredential = await signUpUserWithEmail(params.email, params.password);
//       } catch (error) {
//         debugger
//       }
//       // await sendVerificationEmail(userCredential, window.location.origin);
//     },
//     {
//       onError: handleMutationError,
//     },
//   );
// };
