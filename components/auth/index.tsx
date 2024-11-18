"use client";

import Image from "next/image";
import { useCallback } from "react";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useRegisterModal from "@/hooks/useRegisterModal";
import RegisterModal from "../modals/registerModal";
import useLoginModal from "@/hooks/useLoginModal";
import LoginModal from "../modals/loginModal";
import { signIn, useSession } from "next-auth/react";

export default function Auth() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data } = useSession();
  console.log(data);

  const onOpenRegisterModal = useCallback(() => {
    registerModal.onOpen();
  }, [registerModal]);

  const onOpenLoginModal = useCallback(() => {
    loginModal.onOpen();
  }, [loginModal]);

  return (
    <>
      <RegisterModal />
      <LoginModal />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-screen ">
        <Image
          src={"./images/x.svg"}
          alt="'window"
          width={400}
          height={400}
          className="justify-self-center hidden md:block "
          priority
        />

        <div className="flex flex-col justify-center md:justify-between h-full md:h-[70vh] space-y-6 ">
          <div className="block md:hidden ">
            <Image
              src={"./images/x.svg"}
              alt="'window"
              width={50}
              height={50}
              className="justify-self-center hidden md:block "
              priority
            />
          </div>

          <h1 className="text-6xl font-bold ">Happining Now</h1>
          <div className="md:w-[60%] w-full ">
            <h2 className="text-3xl font-bold mb-4 ">Join today</h2>
            <div className="flex flex-col space-y-2 ">
              <Button
                onClick={() => signIn("google")}
                label={
                  <div className="flex justify-center items-center gap-2 ">
                    <FcGoogle />
                    Singup with google
                  </div>
                }
                fullWidth
                secondary
              />
              <Button
                onClick={() => signIn("github")}
                label={
                  <div className="flex justify-center items-center gap-2 ">
                    <AiFillGithub />
                    Singup with github
                  </div>
                }
                fullWidth
                secondary
              />
              <div className="flex items-center justify-center">
                <div className="h-px bg-gray-700 w-1/2 "></div>
                <div className="mx">or</div>
                <div className="h-px bg-gray-700 w-1/2 "></div>
              </div>

              <Button
                label="Create account"
                fullWidth
                onClick={onOpenRegisterModal}
              />

              <div className="text-[10px] Itext-gray-400">
                By signing up, you agree to the{" "}
                <span className="text-sky-500">Terms of Service</span> and
                <span className="text-sky-500"> Privacy Policy</span>, including
                <span className="text-sky-500"> Cookie Use</span>.
              </div>
            </div>
          </div>
          <div className="md:w-[60%] w-full ">
            <h3 className="font-medium text-xl mb-4 ">
              Already have an account
            </h3>
            <Button
              label="Sing in"
              outline
              fullWidth
              onClick={onOpenLoginModal}
            />

            {/* <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className="bg-black" >
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog> */}
          </div>
        </div>
      </div>
    </>
  );
}
