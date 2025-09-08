// import { getMutation } from "@/lib/query";
// import { api } from "@/services/api";
//
// export interface VerifyCaptchaParams {
//   captchaToken: string;
// }
//
// export const useVerifyCaptcha = () => {
//   return getMutation<{ success: boolean; }, any, VerifyCaptchaParams>(['verifyCaptcha'], async (params: VerifyCaptchaParams) => {
//     return api.post('auth/captcha/verify', {
//       json: {
//         captchaToken: params.captchaToken,
//       },
//     }).json()
//   })
// }