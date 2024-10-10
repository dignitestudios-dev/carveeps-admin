import React from "react";
import { PiAddressBookDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

const SidebarLink = ({ title, link, icon }) => {
  return (
    <Link
      to={link}
      className="group w-full h-12 border border-gray-200 hover:border-[#ff204e] focus:border-[#ff204e] rounded-full flex justify-start items-center "
    >
      <span className="flex w-1/6 h-full rounded-l-full border-r border-gray-200 group-hover:border-[#f16e88] group-hover:text-[#ff204e] group-focus:border-[#ff204e] group-focus:text-[#ff204e] justify-center items-center text-xl  text-gray-700 ">
        {icon}
      </span>
      <span className="px-3  group-hover:text-[#ff204e] group-focus:text-[#ff204e] text-sm font-medium">
        {title}
      </span>
    </Link>
  );
};

export default SidebarLink;
