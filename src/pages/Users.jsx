import React, { useContext, useEffect, useState } from "react";
import { TbFlagHeart } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../components/global/Loader";
import { NoData } from "../assets/export";

const Users = () => {
  const [user, setUser] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { baseUrl, navigateToLink } = useContext(GlobalContext);
  const [userLoading, setUserLoading] = useState(false);

  const getusers = () => {
    const token = Cookies.get("token");

    if (token) {
      setUserLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.get(`${baseUrl}/admin/user`, { headers }).then(
        (response) => {
          setUser(response?.data?.data);
          setUserLoading(false);
        },
        (error) => {
          setUserLoading(false);
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

  useEffect(() => {
    getusers();
  }, []);

  const filteredData = user?.filter(
    (person) =>
      person?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      person?.email?.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div className="w-full   mt-2 h-auto flex justify-start items-center ">
        <input
          type="text"
          id="name"
          placeholder="John Smith"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className=" block w-full rounded-l-full border border-gray-200 px-3 py-2 shadow-sm outline-none focus:border-[#ff204e] focus:ring focus:ring-red-200 focus:ring-opacity-50"
        />
        <button className="active:scale-95 rounded-r-full border border-[#ff204e] bg-[#ff204e] px-8 py-2 font-medium text-white outline-none focus:ring focus:ring-red-200 hover:opacity-90">
          Search
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white px-6 py-2 ">
        {userLoading ? (
          <Loader />
        ) : filteredData?.length < 1 ? (
          <div className="w-full flex justify-center items-center">
            <img src={NoData} className="" alt="" />
          </div>
        ) : (
          <table className="w-full border-collapse  text-left text-sm text-gray-500">
            <thead className="">
              <tr className="">
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Dealership
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Subscription Status
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredData?.length > 0 &&
                filteredData?.map((user) => {
                  return (
                    <tr key={user?._id} className="">
                      <th className="px-6 lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                        <div className="relative h-10 w-10">
                          <img
                            className="h-full w-full rounded-full object-cover object-center"
                            src={
                              user?.profilePicture
                                ? user?.profilePicture
                                : "https://avatar.iran.liara.run/public/boy?username=Ash"
                            }
                            alt=""
                          />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-700">
                            {user?.name}
                          </div>
                          <div className="text-gray-400">{user?.email}</div>
                        </div>
                      </th>
                      <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                        {user?.dealership?.name}
                      </td>

                      <td className="px-6 lg:px-4 xl:px-0 py-4">
                        {user?.subscriptionStatus ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 lg:px-4 xl:px-0 py-4">
                        {user?.city && user?.state && user?.country
                          ? user?.city + " " + user?.state + " " + user?.country
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
