import React from "react";
import { Link } from "react-router-dom";
import { NoData } from "../../assets/export";

const RecentUsers = ({ users }) => {
  const formatDateFromISOString = (isoString) => {
    const splittedString = String(isoString).split("T")[0];
    const [year, month, day] = splittedString.split("-");
    const formattedString = `${month}-${day}-${year}`;
    const date = new Date(formattedString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="w-full h-auto lg:h-[420px] border rounded-xl flex flex-col py-4 md:py-6">
      <div className="px-6 mb-6 flex justify-between items-center">
        <p className="text-base font-semibold">Recent Users</p>
        <Link
          to={"/users"}
          className="w-auto px-4 flex justify-center items-center h-10 rounded-full  text-sm bg-[#ff204e] text-white font-normal"
        >
          View All
        </Link>
      </div>
      <div className="border border-slate-200 rounded-xl"></div>
      <div className="w-full grid grid-cols-3 px-6 py-4">
        <p className="text-sm font-medium ">User</p>
        <p className="text-sm font-medium ">Date</p>
        <p className="text-sm font-medium ">Dealership</p>
        {/* <p className="text-sm font-medium ">Amount</p> */}
      </div>
      <div className="border border-slate-200 rounded-xl"></div>
      {!users || users?.length < 1 ? (
        <div className="w-full h-full flex items-center justify-center">
          <img src={NoData} className="w-[40%]" alt="" />
        </div>
      ) : (
        users?.slice(0, 5)?.map((user, key) => {
          return (
            <div className="w-full grid grid-cols-3 px-6 py-4 border-b">
              <p className="text-sm font-medium text-[#7c7c7c]">
                {user?.name ? user?.name : "N/A"}
              </p>
              <p className="text-sm font-medium text-[#7c7c7c]">
                {formatDateFromISOString(user?.createdAt)}
              </p>
              <p className="text-sm font-medium text-[#7c7c7c]">
                {user?.dealership?.name}
              </p>
              {/* <p className="text-sm font-medium text-[#7c7c7c]">$99</p> */}
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentUsers;
