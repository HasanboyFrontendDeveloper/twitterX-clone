"use client";

import Header from "@/components/shared/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import useNotifications from "@/hooks/useNotifications";
import { IPost } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { userId }: { userId: string } = useParams();
  const { data: session }: any = useSession();
  const router = useRouter();

  const { data, isLoading, mutate } = useNotifications(userId);

  const onClear = async () => {
    try {
      setIsClearing(true);
      await axios.delete(`/api/notifications/${userId}`);
      mutate();
      setIsClearing(false);
    } catch (error) {
      console.log(error);
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (session !== undefined && userId !== undefined) {
      if (session.currentUser._id !== userId) {
        setIsUser(false);

        router.push("/");
        console.log("redirect");

        return;
      } else {
        setIsUser(true);
      }
    }
  }, [session, userId]);

  console.log(data);

  return (
    <div>
      <Header label="Notifications" isBack />

      {isLoading && !isUser ? (
        <div className="flex justify-center items-center h-24 ">
          <Loader2 className="animate-spin text-sky-500 " />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {data?.length > 0 ? (
              data.map((notification: IPost) => (
                <div
                  className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800 "
                  key={notification._id}
                >
                  <Avatar>
                    <AvatarImage src={notification.user?.profileImage} />
                    <AvatarFallback className="uppercase">
                      {notification.user?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-white ">
                    <Link href={`/profile/${notification.user._id}`} className="hover:underline" >
                      {notification.user?.name}
                    </Link>{" "}
                    {notification.body}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="text-neutral-800 text-xl text-center p-6 ">
                  No Notifications
                </div>
              </>
            )}

            {data?.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  label="Clear All"
                  outline
                  onClick={onClear}
                  disabled={isClearing}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
