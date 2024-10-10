import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { SiToyota } from "react-icons/si";

const PackageCard = () => {
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <div className="w-full h-auto rounded-[12px] p-6 flex flex-col gap-5 border cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] bg-red-200 flex items-center justify-center rounded-md">
                <SiToyota className="text-[#C20028]" />
              </div>
              <span className="text-[16px] font-medium">CarZone</span>
            </div>
            <div className="w-[116px] py-1.5 rounded-full text-center text-white text-sm font-semibold bg-[#C20028]">
              DriveCare Plus
            </div>
          </div>
          <h1 className="text-[40px] font-bold relative">
            <sup className="text-xs font-normal absolute top-4 -left-2">$</sup>
            90
            <sub className="text-xs font-normal">/annualy</sub>
          </h1>
        </div>
        <p className="text-base font-normal flex items-center gap-1">
          <GoDotFill /> Package feature goes here
        </p>
        <p className="text-base font-normal flex items-center gap-1">
          <GoDotFill /> Package feature goes here
        </p>
        <p className="text-base font-normal flex items-center gap-1">
          <GoDotFill /> Package feature goes here
        </p>
        <p className="text-base font-normal flex items-center gap-1">
          <GoDotFill /> Package feature goes here
        </p>
        <p className="text-base font-normal flex items-center gap-1">
          <GoDotFill /> Package feature goes here
        </p>
      </div>
    </>
  );
};

export default PackageCard;
