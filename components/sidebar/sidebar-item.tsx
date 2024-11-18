import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  label: string;
  icon: LucideIcon;
}

const SidebarItem = ({ icon: Icon, label }: Props) => {
  return (
    <div className="flex flex-row items-center ">
      {/* Mobile Sidebar Item */}
      <div className="relative rounded-full h-14 w-14 flex justify-center items-center p-4 hover:bg-slate-300 hover:bg-opacity-10 lg:hidden  ">
        <Icon size={28} color="white" />
      </div>

      {/* Desktop Sidebar Item */}
      <div className="relative rounded-full w-full lg:flex hidden gap-4 justify-start items-center p-4 hover:bg-slate-300 hover:bg-opacity-10   ">
        <Icon size={24} color="white" />
        <p className=" hidden lg:block text-xl text-white " >{label} </p>
      </div>
    </div>
  );
};

export default SidebarItem;
