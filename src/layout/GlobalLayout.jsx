import React, { useRef, useState } from "react";
import { Logo } from "../assets/export";
import { PiCaretDown } from "react-icons/pi";
import Sidebar from "./Sidebar";
import { CgMenuLeftAlt } from "react-icons/cg";

const GlobalLayout = ({ page }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-screen h-screen flex justify-start items-start">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="w-full relative lg:w-[calc(100%-15rem)] xl:w-[calc(100%-18rem)] h-full  overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 left-0 w-full h-16 bg-white z-[1000] border-b border-gray-200 flex items-center justify-start lg:justify-end px-4">
          <button
            className="block lg:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <CgMenuLeftAlt className="text-3xl text-[#ff204e]" />
          </button>
          {/* <div class="flex gap-3 items-center  py-4 font-normal text-gray-900">
            <div class="relative bg-[#c00000]/[0.05] rounded-full h-10 w-10">
              <img
                class="h-full w-full rounded-full object-cover object-center"
                src={Logo}
                alt=""
              />
            </div>
            <div class="text-sm flex flex-col justify-start items-start">
              <div class="font-semibold text-gray-700 leading-tight">
                Steven Jobs
              </div>
              <div class="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </div> */}
        </div>
        <div className="w-full ">{page}</div>
      </div>
    </div>
  );
};

export default GlobalLayout;
