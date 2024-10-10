import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

const ChatBox = ({ setIsOpen }) => {
  return (
    <div className="flex-1 p:6 sm:p-6 justify-between flex flex-col h-[80.5vh] lg:h-[85vh] border rounded-xl">
      <div className="flex sm:items-center justify-between px-6 py-3 pb-2 border-b-2 border-gray-200">
        <h1 className="text-[18px] font-bold">Help And Support</h1>
        <button onClick={() => setIsOpen(true)} className="block lg:hidden">
          <FiMenu />
        </button>
      </div>
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col space-y-0 text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-50 text-black">
                  Can be verified on any platform using docker
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-[#FF4068] text-white ">
                  Your error message says permission denied, npm global installs
                  must be given root privileges.
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-gray-50 text-black">
                  Command was run with root privileges. I'm sure about that.
                </span>
                <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              </div>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-gray-50 text-black">
                  I've update the description so it's more obviously now
                </span>
                <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              </div>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-50 text-black">
                  Check the line above (it ends with a # so, I'm running it as
                  root )<pre># npm install -g @vue/devtools</pre>
                </span>
                <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-[#FF4068] text-white ">
                  Any updates on this issue? I'm getting the same error when
                  trying to install devtools. Thanks
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-50 text-black">
                  Thanks for your message David. I thought I'm alone with this
                  issue. Please, ? the issue to support it :)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-[#FF4068] text-white ">
                  Are you using sudo?
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-[#FF4068] text-white ">
                  Run this command sudo chown -R `whoami` /Users/ /.npm-global/
                  then install the package globally without using sudo
                </span>
                <span className="text-[10px] text-[#5C5C5C] float-end">
                  10:09
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-gray-50 text-black">
                  It seems like you are from Mac OS world. There is no /Users/
                  folder on linux ?
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-50 text-black">
                  I have no issue with any other packages installed with root
                  permission globally.
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-[#FF4068] text-white ">
                  yes, I have a mac. I never had issues with root permission as
                  well, but this helped me to solve the problem
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
        <div className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-gray-50 text-black">
                  I get the same error on Arch Linux (also with sudo)
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block bg-gray-50 text-black">
                  I also have this issue, Here is what I was doing until now:
                  #1076
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-50 text-black">
                  even i am facing
                </span>
              </div>
              <span className="text-[10px] text-[#5C5C5C]">10:09</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 mb-2 sm:mb-0 rounded-full flex gap-2">
        <div className="w-full flex items-center justify-between bg-gray-100 px-4 rounded-full h-[50px]">
          <button>
            <BsEmojiSmile className="w-4 h-4" />
          </button>
          <input
            type="text"
            className="w-full h-full bg-transparent outline-none px-3 text-xs text-[#5C5C5C]"
            placeholder="Message"
          />
        </div>
        <button className="bg-[#FF204E] h-[50px] w-[50px] flex items-center justify-center px-4 rounded-full">
          <IoSend className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
