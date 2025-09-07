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
import { useSendLinkToEmail } from "@/features/auth/queries/use-send-link-to-email";
import { defaultVariants } from "@/lib/framer";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })

export const SignupForm = ({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) => {
  const sendLinkToEmail = useSendLinkToEmail();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          sendLinkToEmail.mutate(
            {
              email: params.email,
            },
            {
              onSuccess: () => {
                onEmailSent(params.email);
              },
            },
          );
        })}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <FormField
              name="email"
              render={(props) => (
                <motion.div variants={defaultVariants.child}>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a valid email..." {...props.field} />
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
              className="w-full backdrop-blur-2xl"
              disabled={!form.formState.isValid}
              pending={sendLinkToEmail.isPending}
            >
              Sign Link
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  );
};
