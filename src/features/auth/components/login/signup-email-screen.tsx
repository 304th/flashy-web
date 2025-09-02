import React from "react";
import { SignupForm } from "@/features/auth/components/login/signup-form";
import { SocialAuth } from "@/features/auth/components/login/social-auth";

export const SignupEmailScreen = ({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) => {
  return (
    <>
      <div
        className="flex flex-col w-full justify-center"
      >
        <p
          className="text-3xl font-extrabold text-white"
        >
          Welcome to Flashy
        </p>
        <p>
          Register to create your account
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full min-h-[300px]">
        <SignupForm onEmailSent={onEmailSent} />
        <SocialAuth />
      </div>
    </>
  );
};
