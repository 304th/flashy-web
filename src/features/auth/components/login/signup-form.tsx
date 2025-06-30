import React from "react";
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
import { useSignupWithEmail } from "@/features/auth/queries/useSignupWithEmail";
import { defaultVariants } from "@/lib/framer";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .max(255, "Username is too long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
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
  const signupWithEmail = useSignupWithEmail();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          signupWithEmail.mutate(
            {
              username: params.username,
              email: params.email,
              password: params.password,
            },
            {
              onSuccess: () => {
                onEmailSent(params.email);
              },
            },
          );
        })}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <FormField
              name="username"
              render={(props) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...props.field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />
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
                      <Input type="password" {...props.field} />
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
                      <Input type="password" {...props.field} />
                    </FormControl>
                    <FormMessage />
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
              pending={signupWithEmail.isPending}
            >
              Sign Up
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  );
};
