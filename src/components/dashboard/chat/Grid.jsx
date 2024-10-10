import React, { useState, useRef } from "react";
import ChatBox from "./ChatBox";
import ChatUserCard from "./ChatUserCard";
import { IoSearchOutline } from "react-icons/io5";

const Grid = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const toggleModal = (e) => {
    if (!ref.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  return (
    <div className="h-auto  pt-0 rounded-[18px]">
      <div className="w-full relative grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2">
          <ChatBox setIsOpen={setIsOpen} />
        </div>
        <div
          onClick={(e) => toggleModal(e)}
          className="w-full absolute top-0 right-0 flex justify-end items-start lg:static lg:block  lg:col-span-1"
        >
          <div
            ref={ref}
            className={`${
              isOpen ? "flex w-2/3" : "hidden"
            } lg:flex lg:w-full transition-all duration-500  bg-white z-20 flex-col items-center gap-6 pt-6 border px-2 lg:px-6 pb-4 rounded-xl h-[80.5vh] lg:h-[85vh]`}
          >
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-10 rounded-full px-3 outline-none border border-gray-200 text-gray-700"
              />
              <button className="w-8 h-8 absolute top-1 right-1 rounded-full text-md text-white bg-[#ff204e] flex items-center justify-center">
                <IoSearchOutline />
              </button>
            </div>
            <div className="w-full h-[75%] overflow-y-auto flex justify-start items-start flex-col gap-2">
              <ChatUserCard />
              <ChatUserCard />
              <ChatUserCard />
              <ChatUserCard />
              <ChatUserCard />
              <ChatUserCard />
              <ChatUserCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
