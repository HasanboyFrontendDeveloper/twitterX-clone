"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "@/types";
import { sliceText } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import axios from "axios";

interface Props {
  user: IUser;
  onChangeFollowing?: (user: IUser[]) => void;
  isFollow?: boolean;
  following?: IUser[];
}

const User = ({ user, onChangeFollowing, isFollow, following }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session }: any = useSession();
  const router = useRouter();

  const onFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put("/api/follows", {
        userId: user._id,
        currentUserId: session.currentUser._id,
      });

      const updatedFollowing = [...(following as IUser[]), user];

      onChangeFollowing && onChangeFollowing(updatedFollowing);

      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUnfollow = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/follows", {
        data: { userId: user._id, currentUserId: session.currentUser._id },
      });

      const updatedFollowers = (following as IUser[])?.filter(
        (item) => item._id !== user._id
      );

      onChangeFollowing && onChangeFollowing(updatedFollowers);

      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex gap-3 items-center justify-between hover:bg-slate-300 hover:bg-opacity-10 transition px-3 py-2 rounded-lg ">
      <div className="flex gap-2 cursor-pointer ">
        <Avatar>
          <AvatarImage src={user.profileImage} />
          <AvatarFallback className="uppercase">{user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="text-sm text-white font-semibold line-clamp-1 ">
            {user.name}
          </p>
          <p className="text-sm text-neutral-400 line-clamp-1 ">
            {user.username
              ? `@${sliceText(user.username, 20)}`
              : sliceText(user.email, 20)}
          </p>
        </div>
      </div>
      {isFollow && user._id !== session?.currentUser?._id ? (
        user.followers.includes(session.currentUser?._id) ? (
          <Button
            label={"Unfollow"}
            disabled={isLoading}
            onClick={onUnfollow}
            outline
            classNames="h-[30px] p-0 w-fit px-3 text-sm "
          />
        ) : (
          <Button
            label={"Follow"}
            disabled={isLoading}
            onClick={onFollow}
            classNames="h-[30px] p-0 w-fit px-3 text-sm "
          />
        )
      ) : null}
    </div>
  );
};

export default User;
