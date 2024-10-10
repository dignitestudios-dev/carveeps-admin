import React from "react";
import { Link } from "react-router-dom";
import { NoData } from "../../assets/export";

const RecentDealers = ({ dealerships }) => {
  const formatDateFromISOString = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="w-full h-auto lg:h-[420px] border rounded-xl flex flex-col py-4 md:py-6">
      <div className="px-6 mb-6 flex justify-between items-center">
        <p className="text-base font-semibold">Recent Dealers</p>
        <Link
          to={"/dealerships"}
          className="w-auto px-4 flex justify-center items-center h-10 rounded-full  text-sm bg-[#ff204e] text-white font-normal"
        >
          View All
        </Link>
      </div>
      <div className="border border-slate-200 rounded-xl"></div>
      <div className="w-full grid grid-cols-4 px-6 py-4">
        <p className="text-sm font-medium ">Name</p>
        <p className="text-sm font-medium ">Date</p>
        <p className="text-sm font-medium ">Total Salesperson's</p>
        <p className="text-sm font-medium ">Revenue</p>
      </div>
      <div className="border border-slate-200 rounded-xl"></div>
      {!dealerships || dealerships?.length < 1 ? (
        <div className="w-full h-full flex items-center justify-center">
          <img src={NoData} className="w-[40%]" alt="" />
        </div>
      ) : (
        dealerships?.slice(0, 5)?.map((dealer, key) => {
          return (
            <div
              key={key}
              className="w-full grid grid-cols-4 px-6 py-4 border-b"
            >
              <p className="text-sm font-medium text-[#7c7c7c]">
                {dealer?.name ? dealer?.name : "N/A"}
              </p>
              <p className="text-sm font-medium text-[#7c7c7c]">
                {formatDateFromISOString(dealer?.createdAt)}
              </p>
              <p className="text-sm font-medium text-[#7c7c7c]">
                {dealer?.totalSalesPerson}
              </p>
              <p className="text-sm font-medium text-[#7c7c7c]">
                ${dealer?.revenue}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentDealers;
