import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModals } from "@/hooks/use-modals";
import { useSignInWithEmail } from "@/features/auth/queries/use-sign-in-with-email";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { openModal } = useModals();
  const loginWithEmail = useSignInWithEmail();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit((params) => {
          loginWithEmail.mutate(params, {
            onSuccess,
          });
        })}
      >
        <div className="flex flex-col gap-4">
          <FormField
            name="email"
            render={({ field }) => (
              <motion.div variants={defaultVariants.child}>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e: Event) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </motion.div>
            )}
          />
          <FormField
            name="password"
            render={({ field }) => (
              <motion.div variants={defaultVariants.child}>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "" : "password"}
                      trailingIcon={
                        <IconButton
                          size="xs"
                          type="button"
                          onClick={() => setShowPassword(state => !state)}
                        >
                          {
                            showPassword ? <EyeIcon /> : <EyeClosedIcon />
                          }

                        </IconButton>
                      }
                      onChange={(e: Event) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex w-full justify-end">
                    <p className="text-sm hover:underline cursor-pointer">
                      Forgot password?
                    </p>
                  </div>
                </FormItem>
              </motion.div>
            )}
          />
        </div>
        <motion.div
          className="flex flex-col gap-3 items-center w-full"
          variants={defaultVariants.child}
        >
          <p className="text-sm">
            Don't have account?{" "}
            <span
              className="text-brand-200 hover:underline cursor-pointer"
              onClick={() => openModal("SignupModal")}
            >
              Sign Up
            </span>
          </p>
          <Button
            disabled={!form.formState.isValid}
            pending={loginWithEmail.isPending}
            size="xl"
            className="w-full"
          >
            Log In
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};
