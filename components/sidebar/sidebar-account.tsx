import { IUser } from "@/types";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";
import { sliceText } from "@/lib/utils";

interface Props {
  user: IUser;
}

const SidebarAccount = ({ user }: Props) => {
  return (
    <>
      {/* MOBILE SIDEBAR ACCOUNT */}
      <div className="lg:hidden block ">
        <div
          className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer"
          onClick={() => signOut()}
        >
          <RiLogoutCircleLine size={24} color="white" />
        </div>
      </div>

      {/* DESKTOP SIDEBAR ACCOUNT */}
      <Popover>
        <PopoverTrigger className="w-full rounded-full hover:bg-slate-300 hidden lg:block hover:bg-opacity-10 px-4 py-2 transition cursor-pointer ">
          <div className="flex justify-between items-center gap-2 ">
            <div className="flex gap-2 items-center ">
              <Avatar>
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="uppercase">
                  {user?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-white">
                <p>{sliceText(user.name, 16)}</p>
                {user.username ? (
                  <p className="opacity-40">{user.username}</p>
                ) : (
                  <p className="opacity-40">Manage account</p>
                )}
              </div>
            </div>
            <MoreHorizontal size={24} color="white" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black border-white rounded-2xl px-0 mb-3 ">
          <div
            className="font-bold cursor-pointer text-white hover:bg-slate-300 hover:bg-opacity-10 p-4 transition "
            onClick={() => signOut()}
          >
            Log Out {user.username ? `@${user.username}` : user.name}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SidebarAccount;
