import useLoginModal from "@/hooks/useLoginModal";
import React, { useCallback, useState } from "react";
import Modal from "../ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/button";
import useRegisterModal from "@/hooks/useRegisterModal";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const [error, setError] = useState("");

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter();

  const onToggle = useCallback(() => {
    registerModal.onOpen();
    loginModal.onClose();
  }, [registerModal, loginModal]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const { data } = await axios.post("/api/auth/login", values);

      if (data.success) {
        signIn("credentials", values);
        loginModal.onClose();
        router.push("/");
      }
    } catch (error: any) {
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong, Please try again later");
      }
    }
  }

  const { isSubmitting } = form.formState;

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12 ">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          label="Login"
          type="submit"
          secondary
          fullWidth
          large
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
  const footer = (
    <div className="text-neutral-400 text-center my-4 ">
      <p>
        Don't have an account?{" "}
        <span
          className="text-white cursor-pointer hover:underline transition-all "
          onClick={onToggle}
        >
          Create an account
        </span>{" "}
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      body={bodyContent}
      footer={footer}
    />
  );
}
