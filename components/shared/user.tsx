import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "@/types";
import { sliceText } from "@/lib/utils";

const User = ({ user }: { user: IUser }) => {
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
    </div>
  );
};

export default User;
