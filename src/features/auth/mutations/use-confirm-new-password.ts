import { getMutation } from "@/lib/query-toolkit";
import { confirmNewPassword } from "@/services/firebase";

export interface ConfirmNewPassword {
  oobCode: string;
  newPassword: string;
}

export const useConfirmNewPassword = () =>
  getMutation(["confirmNewPassword"], async (params: ConfirmNewPassword) => {
    return confirmNewPassword({
      oobCode: params.oobCode,
      newPassword: params.newPassword,
    });
  });
