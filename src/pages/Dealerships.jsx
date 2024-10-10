import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import RegisterDealershipModal from "../components/dashboard/dealerships/RegisterDealershipModal";
import Cookies from "js-cookie";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import Loader from "../components/global/Loader";
import { NoData } from "../assets/export";

const Dealerships = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [dealer, setDealer] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { baseUrl, navigateToLink } = useContext(GlobalContext);
  const [dealerLoading, setDealerLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getdealers = () => {
    const token = Cookies.get("token");

    if (token) {
      setDealerLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.get(`${baseUrl}/admin/dealership`, { headers }).then(
        (response) => {
          setDealer(response?.data?.data);
          setDealerLoading(false);
        },
        (error) => {
          setDealerLoading(false);
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
    getdealers();
  }, [update]);

  const filteredData = dealer?.filter(
    (deal) =>
      deal?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      deal?.email?.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div className="w-full h-auto flex justify-end items-center">
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="active:scale-95 rounded-full bg-[#ff204e] px-4 py-2 font-medium text-white outline-none focus:ring focus:ring-red-200 hover:opacity-90"
        >
          Register New Dealership
        </button>
        {isRegisterOpen && (
          <RegisterDealershipModal
            isOpen={isRegisterOpen}
            setIsOpen={setIsRegisterOpen}
            updateData={setUpdate}
          />
        )}
      </div>
      <div className="w-full   mt-2 h-auto flex justify-start items-center ">
        <input
          type="text"
          id="name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="John Smith"
          className=" block w-full rounded-l-full border border-gray-200 px-3 py-2 shadow-sm outline-none focus:border-[#ff204e] focus:ring focus:ring-red-200 focus:ring-opacity-50"
        />
        <button className="active:scale-95 rounded-r-full border border-[#ff204e] bg-[#ff204e] px-8 py-2 font-medium text-white outline-none focus:ring focus:ring-red-200 hover:opacity-90">
          Search
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white px-6 py-2 ">
        {dealerLoading ? (
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
                  Dealership Info
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Total Salesperson
                </th>
                <th
                  scope="col"
                  className="px-6 lg:px-4 xl:px-0 py-4 font-medium text-[#ff204e]"
                >
                  Total Plans
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredData?.length > 0 &&
                filteredData?.map((dealer) => {
                  return (
                    <tr key={dealer?._id} className=" cursor-pointer">
                      <th className="px-6  lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                        <Link
                          to={`/dealerships/${dealer?._id}`}
                          className="w-auto flex gap-2  justify-start items-center"
                        >
                          <div className="relative h-10 w-10">
                            <img
                              className="h-full w-full rounded-full object-cover object-center"
                              src={
                                dealer?.logo
                                  ? dealer?.logo
                                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdbH8lXSyLmoUrFM3pbpOf9dMhvhxBGb28fw&s"
                              }
                              alt=""
                            />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium text-gray-700">
                              {dealer?.name}
                            </div>
                            <div className="text-gray-400">{dealer?.email}</div>
                          </div>
                        </Link>
                      </th>
                      <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                        ${dealer?.revenue}
                      </td>

                      <td className="px-6 lg:px-4 xl:px-0 py-4">
                        {dealer?.address}
                      </td>
                      <td className="px-6 lg:px-4 xl:px-0 py-4">
                        {dealer?.totalSalesPerson}
                      </td>
                      <td className="px-6 lg:px-4 xl:px-0 py-4">
                        {dealer?.totalPlans}
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

export default Dealerships;
