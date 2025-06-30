import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useVerifyOtp } from "@/features/auth/queries/useVerifyOtp";
import { defaultVariants } from "@/lib/framer";
import { OtpInput } from "@/features/auth/components/login/otp-input";

const formSchema = z.object({
  otp: z.string().min(6, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
});

export const OtpForm = ({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) => {
  const verifyOtp = useVerifyOtp();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email,
    },
    mode: "all",
  });

  const otp = form.watch("otp");

  useEffect(() => {
    if (otp.length === 6 && !verifyOtp.isPending) {
      verifyOtp.mutate({ otp, email: form.getValues("email") }, { onSuccess });
    }
  }, [otp]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          verifyOtp.mutate(params, { onSuccess });
        })}
      >
        <div className="flex flex-col gap-8 justify-between h-full">
          <div className="flex flex-col gap-3">
            <FormField
              name="otp"
              render={({ field }) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormControl>
                      <OtpInput {...field} />
                    </FormControl>
                  </FormItem>
                </motion.div>
              )}
            />
          </div>
          <motion.div className="w-full" variants={defaultVariants.child}>
            <Button
              size="xl"
              className="w-full"
              disabled={!form.formState.isValid}
              pending={verifyOtp.isPending}
            >
              Verify
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  );
};
