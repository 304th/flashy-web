"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { PasswordResetForm } from "@/features/auth/components/password-reset-form/password-reset-form";

export default function PasswordReset() {
  return (
    <div
      className="flex flex-col gap-4 w-full h-full justify-center items-center"
    >
      <Suspense>
        <PasswordResetPage />
      </Suspense>
    </div>
  );
}

const PasswordResetPage = () => {
  const router = useRouter();
  const oobCode = useQueryParams("oobCode");

  useEffect(() => {
    if (!oobCode) {
      router.push("/");
    }
  }, [oobCode]);

  if (!oobCode) {
    return null;
  }

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 flex-col gap-4 w-[600px]
        bg-base-200 p-8 rounded-md bg-[url('/images/forest.png')] bg-cover
        border"
    >
      <PasswordResetForm
        oobCode={oobCode}
        onSuccess={() => {
          router.push("/");
        }}
      />
    </div>
  );
};
