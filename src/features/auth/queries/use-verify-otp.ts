// import { api } from "@/services/api";
// import {
//   getMutation,
//   handleMutationError,
//   handleAuthSuccess,
// } from "@/lib/query-toolkit-v2";
// import { useQueryClient } from "@tanstack/react-query";
//
// interface VerifyOtpParams {
//   otp: string;
//   email: string;
// }
//
// export const useVerifyOtp = () => {
//   const queryClient = useQueryClient();
//
//   return getMutation<User, Error, VerifyOtpParams>(
//     ["signupWithEmail"],
//     async ({ otp, email }: VerifyOtpParams) => {
//       return await api
//         .post("verifyEmailAndRegister", {
//           json: { otp, email },
//         })
//         .json<any>();
//     },
//     {
//       onError: handleMutationError,
//       onSuccess: handleAuthSuccess(queryClient),
//     },
//   );
// };
