import { useState } from "react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleSignIn } from "@/features/auth/queries/use-google-sign-in";
import { useModals } from "@/hooks/use-modals";

export const GoogleSignIn = () => {
  const [initiated, setInitiated] = useState(false);
  const signInWithGoogle = useGoogleSignIn();
  const { closeModal } = useModals();
  const disabled = initiated || signInWithGoogle.isPending;

  return (
    <div
      className="relative aria-disabled:grayscale
        aria-disabled:pointer-events-none"
      aria-disabled={disabled}
      onClick={() => setInitiated(true)}
    >
      <div
        className="absolute m-[-4px] rounded inset-0 aria-disabled:skeleton"
        aria-disabled={disabled}
      />
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            signInWithGoogle.mutate(
              { credential: credentialResponse.credential as JwtToken },
              {
                onSuccess: () => closeModal(),
              },
            );
          } else {
            toast.error("Google SignIn failed");
          }

          setInitiated(false);
        }}
        onError={() => {
          toast.error("Google SignIn failed");
          setInitiated(false);
        }}
        theme="filled_blue"
        shape="square"
        size="large"
      />
    </div>
  );
};
