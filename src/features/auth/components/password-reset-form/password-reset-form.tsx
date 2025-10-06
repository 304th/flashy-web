"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useConfirmNewPassword } from "@/features/auth/mutations/use-confirm-new-password";
import { defaultVariants } from "@/lib/framer";

const formSchema = z
  .object({
    oobCode: z.string(),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const PasswordResetForm = ({
  oobCode,
  onSuccess,
}: {
  oobCode: string;
  onSuccess: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oobCode: oobCode,
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const confirmNewPassword = useConfirmNewPassword();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (params) => {
          confirmNewPassword.mutate(
            {
              oobCode: params.oobCode,
              newPassword: params.password,
            },
            {
              onSuccess,
            },
          );
        })}
        className="flex flex-col gap-4 w-full"
      >
        <h1 className="text-3xl font-extrabold text-white">Reset password</h1>
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
                        {showConfirmPassword ? <EyeIcon /> : <EyeClosedIcon />}
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
        <Button
          disabled={!form.formState.isValid}
          pending={confirmNewPassword.isPending}
          size="xl"
          className="w-full"
        >
          Send password reset
        </Button>
      </form>
    </Form>
  );
};
