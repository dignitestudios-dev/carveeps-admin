import React from "react";
import { MdOutlinePending } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { TbUrgent } from "react-icons/tb";
import { FaReply } from "react-icons/fa";
import { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../context/GlobalContext";
import { useEffect } from "react";
import Loader from "../components/global/Loader";
import { NoData } from "../assets/export";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { baseUrl, navigateToLink } = useContext(GlobalContext);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getTickets = () => {
    const token = Cookies.get("token");

    if (token) {
      setTicketsLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.get(`${baseUrl}/admin/tickets`, { headers }).then(
        (response) => {
          setTickets(response?.data?.data);
          setTicketsLoading(false);
        },
        (error) => {
          setTicketsLoading(false);
          if (error?.response?.status == 401) {
            Cookies.remove("token");
            navigateToLink("/login");
          }
        }
      );
    } else {
      navigateToLink("/login");
    }
  };
  const formatDateFromISOString = (isoString) => {
    const splittedString = String(isoString).split("T")[0];
    const [year, month, day] = splittedString.split("-");
    const formattedString = `${month}-${day}-${year}`;
    const date = new Date(formattedString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    getTickets();
  }, []);

  const filteredData = tickets?.filter(
    (item) =>
      item?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.dealership?.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="w-full p-6 h-auto flex flex-col justify-start items-start gap-3">
      <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
        <h1 className="w-auto text-5xl font-bold text-gray-700">Tickets</h1>

        <div className="w-full    h-auto flex justify-start items-center ">
          <input
            type="text"
            id="name"
            placeholder="Title of Ticket"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className=" block w-full rounded-l-full border border-gray-200 px-3 h-12 shadow-sm outline-none focus:border-[#ff204e] focus:ring focus:ring-red-200 focus:ring-opacity-50"
          />
          <button className="active:scale-95 rounded-r-full border border-[#ff204e] bg-[#ff204e] px-8 h-12 font-medium text-white outline-none focus:ring focus:ring-red-200 hover:opacity-90">
            Search
          </button>
        </div>

        <div className="w-full flex justify-center items-center">
          {ticketsLoading && <Loader />}
          {!ticketsLoading && filteredData?.length < 1 && (
            <div className="w-full flex justify-center items-center">
              <img src={NoData} className="" alt="" />
            </div>
          )}
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-start items-center gap-4 h-auto">
          {!ticketsLoading &&
            filteredData?.length > 0 &&
            filteredData?.map((ticket, key) => {
              return (
                <div key={key} className="min-h-48 h-48 relative">
                  <div className="w-full h-full max-h-48 rounded-xl border shadow-sm flex flex-col gap-4 justify-start items-start p-4">
                    <div className="w-full flex justify-between items-center">
                      <div className="w-auto h-auto flex justify-start items-center gap-2">
                        <span className="w-auto h-auto relative">
                          <img
                            src={ticket?.dealership?.logo}
                            className="w-12 h-12 rounded-full shadow-sm"
                          />
                        </span>
                        <div className="w-auto flex flex-col justify-start items-start">
                          <h3 className="text-sm font-semibold">
                            {ticket?.dealership?.name}
                          </h3>

                          <h3 className="text-[10px] text-[#ff204e] font-semibold">
                            {formatDateFromISOString(ticket?.createdAt)}
                          </h3>
                        </div>
                      </div>
                      <div className="w-auto  h-auto flex justify-end items-center">
                        <a
                          href={`mailto:${ticket?.dealership?.email}`}
                          className="w-auto px-3 h-8 rounded-full flex justify-start items-center gap-2 text-sm font-medium bg-[#ff204e] text-white"
                        >
                          <FaReply />
                          Reply
                        </a>
                      </div>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start ">
                      <h3 className="text-lg font-bold text-gray-800">
                        {ticket?.title}
                      </h3>
                      <p className="text-[11px] w-[90%] font-medium text-gray-600">
                        {ticket?.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
