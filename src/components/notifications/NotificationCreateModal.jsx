import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import BtnLoader from "../global/BtnLoader";
import axios from "axios";
import Cookies from "js-cookie";

const NotificationCreateModal = ({ isOpen, setIsOpen, setUpdate }) => {
  const notificationCreateRef = useRef();
  const navigate = useNavigate();
  const [sendToDealer, setIsSendToDealer] = useState(false);

  const toggleModal = (e) => {
    if (!notificationCreateRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const { baseUrl, setError } = useContext(GlobalContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      setLoading(true);
      axios
        .post(
          `${baseUrl}/admin/notifications`,
          {
            title: title,
            description: description,
          },
          { headers }
        )
        .then((response) => {
          setLoading(false);
          setTitle("");
          setDescription("");
          setUpdate((prev) => !prev);
          setIsOpen(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(error?.response?.data?.message);
        });
    }
  };

  return (
    <div
      onClick={(e) => toggleModal(e)}
      className={`w-screen h-screen flex p-2 items-center justify-center fixed top-0 left-0 z-[1000] transition-all duration-500 ${
        isOpen ? "scale-100 blur-none" : "scale-0 blur-md"
      }`}
    >
      <div
        ref={notificationCreateRef}
        className="w-[30rem] h-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl bg-white"
      >
        <div className="w-full border-b border-gray-200 h-12 flex items-center justify-center">
          <h1 className="text-xl font-bold">Send Notification</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full my-4 h-auto flex flex-col justify-start items-start px-4 gap-2"
        >
          <div className="w-full h-auto flex flex-col gap-[2px] justify-start items-start ">
            <label className="text-sm font-medium mx-3 text-gray-900">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bank Account Integration."
              className="w-full h-12 rounded-full px-4 outline-none focus:border-gray-300 border border-gray-200"
            />
          </div>
          {/* {sendToDealer && (
            <div className="w-full h-auto flex flex-col gap-[2px] justify-start items-start ">
              <label className="text-sm font-medium mx-3 text-gray-900">
                Dealership
              </label>
              <select
                type="text"
                placeholder="e.g. Bank Account Integration."
                className="w-full h-12 rounded-full px-4 outline-none focus:border-gray-300 border border-gray-200"
              >
                <option>--Select--</option>
                <option>Car Zone</option>
              </select>
            </div>
          )} */}

          <div className="w-full h-auto flex flex-col gap-[2px] justify-start items-start ">
            <label className="text-sm font-medium mx-3 text-gray-900">
              Message
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Car Zone is requested to integrate it's Bank Account as soon as possible."
              className="w-full h-32 resize-none rounded-xl p-3 outline-none focus:border-gray-300 border border-gray-200"
            ></textarea>
          </div>
          {/* <div className="w-full h-auto ml-1 flex gap-2 justify-start items-center">
            <div className="w-1/2 flex gap-2 justify-start items-center">
              <input
                type="checkbox"
                className="text-md w-4 h-4 accent-[#ff204e]"
                onChange={() => setIsSendToDealer((prev) => !prev)}
              />
              <label className="text-sm font-medium  text-gray-900">
                Send to Specific Dealer
              </label>
            </div>
            <div className="w-1/2 flex gap-2 justify-start items-center">
              <input
                type="checkbox"
                className="text-md w-4 h-4 accent-[#ff204e]"
              />
              <label className="text-sm font-medium  text-gray-900">
                Send to All Users
              </label>
            </div>
          </div>
          <div className="w-full h-auto ml-1 flex gap-2 justify-start items-center">
            <div className="w-1/2 flex gap-2 justify-start items-center">
              <input
                type="checkbox"
                className="text-md w-4 h-4 accent-[#ff204e]"
              />
              <label className="text-sm font-medium  text-gray-900">
                Send to All Dealers
              </label>
            </div>

            <div className="w-1/2 flex gap-2 justify-start items-center">
              <input
                type="checkbox"
                className="text-md w-4 h-4 accent-[#ff204e]"
              />
              <label className="text-sm font-medium  text-gray-900">
                Send to All
              </label>
            </div>
          </div> */}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-12 rounded-full flex justify-center items-center text-white font-medium bg-[#ff204e] hover:opacity-90 transition-all duration-200"
          >
            {loading ? <BtnLoader /> : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationCreateModal;
