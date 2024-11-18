import { Feather } from "lucide-react";
import Link from "next/link";
import React from "react";

const SidebarPostButton = () => {
  return (
    <Link href={'/'} >
      {/* Mobile Post */}
      <div className="mt-6 lg:hidden h-14 w-14 rounded-full p-4 flex items-center justify-center bg-sky-500 hover:opacity-80 transition cursor-pointer ">
        <Feather size={24} color="white" />
      </div>

      {/* Desktop Post */}
      <div className="mt-6 hidden w-full rounded-full px-4 py-2 lg:flex items-center justify-center bg-sky-500 hover:opacity-80 transition cursor-pointer ">
        <p className="text-center font-semibold text-white text-[20px] " >POST</p>
      </div>
    </Link>
  );
};

export default SidebarPostButton;
