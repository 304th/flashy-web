import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreRegisterEmail } from "@/features/auth/queries/use-pre-register-email";
import { defaultVariants } from "@/lib/framer";
import { IconButton } from "@/components/ui/icon-button";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    captchaToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignupForm = ({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const preRegisterEmail = usePreRegisterEmail();
  // const signupWithEmail = useSignupWithEmail();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      captchaToken: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          preRegisterEmail.mutate(
            {
              email: params.email,
              password: params.password,
              captchaToken: params.captchaToken,
            },
            {
              onSuccess: (response) => {
                console.log(`Email: ${response.email} - OTP: ${response.otp}`);
                onEmailSent(params.email);
              },
            },
          );
        })}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <FormField
              name="email"
              render={(props) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...props.field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />
            <FormField
              name="password"
              render={(props) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "" : "password"}
                        trailingIcon={
                          <IconButton
                            size="xs"
                            type="button"
                            onClick={() => setShowPassword((state) => !state)}
                          >
                            {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                          </IconButton>
                        }
                        {...props.field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />
            <FormField
              name="confirmPassword"
              render={(props) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "" : "password"}
                        trailingIcon={
                          <IconButton
                            size="xs"
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((state) => !state)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeIcon />
                            ) : (
                              <EyeClosedIcon />
                            )}
                          </IconButton>
                        }
                        {...props.field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />
          </div>
          <motion.div
            className="flex flex-col w-full items-center justify-center gap-5"
            variants={defaultVariants.child}
          >
            <Button
              size="xl"
              className="w-full"
              disabled={!form.formState.isValid}
              pending={preRegisterEmail.isPending}
            >
              Sign Up
            </Button>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
              onSuccess={(turnstileToken) => {
                form.setValue("captchaToken", turnstileToken, {
                  shouldValidate: true,
                });
              }}
              onError={(error) => {
                console.log(error);
              }}
            />
          </motion.div>
        </div>
      </form>
    </Form>
  );
};
