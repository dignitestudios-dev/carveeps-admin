import React, { useState } from "react";
import { NoData, Notification } from "../assets/export";
import { IoSearchOutline } from "react-icons/io5";
import NotificationCreateModal from "../components/notifications/NotificationCreateModal";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";
import Loader from "../components/global/Loader";

const Notifications = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState("");

  const { navigateToLink, baseUrl, setError } = useContext(GlobalContext);

  const getNotifications = () => {
    const token = Cookies.get("token");
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      setDataLoading(true);
      axios
        .get(`${baseUrl}/admin/notifications`, { headers })
        .then((response) => {
          setData(response?.data?.data);
          setDataLoading(false);
        })
        .catch((error) => {
          setDataLoading(false);
          setError(error?.response?.data?.message);
        });
    }
  };

  useEffect(() => {
    getNotifications();
  }, [update]);

  const filteredData = data?.filter(
    (item) =>
      item?.title?.toLowerCase().includes(search.toLowerCase()) ||
      item?.description?.toLowerCase().includes(search.toLowerCase())
  );
  const formatDateFromISOString = (isoString) => {
    if (isoString == null) return "N/A";
    const splittedString = String(isoString).split("T")[0];
    const [year, month, day] = splittedString.split("-");
    const formattedString = `${month}-${day}-${year}`;
    const date = new Date(formattedString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full flex flex-col p-6 justify-start items-start gap-3">
      <div className="w-full h-auto flex justify-between items-center">
        <div className="w-96 relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-full px-3 outline-none border border-gray-200 text-gray-700"
          />
          <button className="w-8 h-8 absolute top-1 right-1 rounded-full text-md text-white bg-[#ff204e] flex items-center justify-center">
            <IoSearchOutline />
          </button>
        </div>
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="w-32 h-10 rounded-full bg-[#ff204e] text-white text-sm font-medium"
        >
          Send New
        </button>
      </div>
      <div className="w-full flex justify-center items-center">
        {dataLoading && <Loader />}
        {!dataLoading && filteredData?.length < 1 && <img src={NoData} />}
      </div>

      <div className="w-full h-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
        {!dataLoading &&
          filteredData?.length > 0 &&
          filteredData?.map((notification) => {
            return (
              <div
                key={notification?._id}
                class=" flex  rounded-xl border border-gray-200 p-4 text-left text-gray-600  sm:p-4"
              >
                <img
                  class="mr-5 block h-8 w-8 max-w-full text-left align-middle sm:h-8 sm:w-8"
                  src={Notification}
                  alt="Profile Picture"
                />
                <div class="w-full text-left">
                  <div class="mb-2 flex flex-col justify-between text-gray-600 sm:flex-row">
                    <h3 class="font-medium">{notification?.title}</h3>
                    <time class="text-xs" datetime="2022-11-13T20:00Z">
                      {formatDateFromISOString(notification?.createdAt)}
                    </time>
                  </div>
                  <p class="text-sm">{notification?.description}</p>
                </div>
              </div>
            );
          })}
      </div>
      <NotificationCreateModal
        isOpen={isNotificationOpen}
        setIsOpen={setIsNotificationOpen}
        setUpdate={setUpdate}
      />
    </div>
  );
};

export default Notifications;
