import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
// import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { defaultVariants } from "@/lib/framer";

export const SignupForm = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((params) => {
          console.log(params);
        })}
      >
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
                    <Input {...props.field} />
                  </FormControl>
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
                    <Input {...props.field} />
                  </FormControl>
                </FormItem>
              </motion.div>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
