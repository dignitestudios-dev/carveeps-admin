import React from "react";
import { NoDataImage } from "../../assets/export";

const NoData = () => {
  return (
    <div className="w-full h-[calc(100vh-15rem)] flex flex-col gap-2 justify-center items-center">
      <img src={NoDataImage} alt="no-data-available" className="w-auto h-80" />
      <h2 className="text-3xl font-bold text-gray-900">No Data Available</h2>
    </div>
  );
};

export default NoData;
