import React from "react";

const ChatUserCard = () => {
  return (
    <div className="group w-full h-14 border hover:bg-[#ff204e] focus:bg-[#ff204e] cursor-pointer p-2 rounded-xl flex gap-2 justify-start items-start">
      <img
        src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
        className="w-10 h-10 rounded-full"
      />
      <div className="w-auto flex flex-col justify-start items-start ">
        <h1 className="text-md font-semibold text-black group-hover:text-white group-focus:text-white leading-tight">
          Car Zone
        </h1>
        <div className="w-auto flex gap-1 justify-start items-center">
          <h1 className="text-xs font-medium text-gray-700 group-hover:text-gray-50 group-focus:text-gray-50">
            Last Chatted
          </h1>
          <h1 className="text-xs font-medium text-black group-hover:text-white group-focus:text-white">
            02/04/2024
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChatUserCard;
