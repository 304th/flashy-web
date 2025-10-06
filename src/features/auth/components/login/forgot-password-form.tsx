import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
import { useSendPasswordReset } from "@/features/auth/mutations/use-send-password-reset";
import { VerificationEmailSentScreen } from "@/features/auth/components/login/verification-email-sent-screen";
import { defaultVariants } from "@/lib/framer";

const formSchema = z.object({
  email: z.string().email("Must be a valid email"),
});

export const ForgotPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const sendResetEmail = useSendPasswordReset();
  const email = form.watch("email");

  if (sendResetEmail.isSuccess) {
    return <VerificationEmailSentScreen email={email} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (params) => {
          sendResetEmail.mutate({
            email: params.email,
          });
        })}
        className="flex flex-col gap-4 w-full"
      >
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
        <Button
          disabled={!form.formState.isValid}
          pending={sendResetEmail.isPending}
          size="xl"
          className="w-full"
        >
          Send password reset
        </Button>
      </form>
    </Form>
  );
};
