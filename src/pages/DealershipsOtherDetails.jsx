import React from "react";
import PackageCard from "../components/dashboard/plans/PackageCard";
import RevenueGraph from "../components/dashboard/dealerships/RevenueGraph";

const DealershipsOtherDetails = () => {
  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
      <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
        <h1 className="ml-1 text-xl font-bold text-black">Revenue</h1>
        <div className="w-full border rounded-xl p-4 h-64">
          <RevenueGraph />
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
        <h1 className="ml-1 text-xl font-bold text-black">User's</h1>
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white px-6 py-2 ">
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
                  State
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
              <tr className="">
                <th className="px-6 lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                  <div className="relative h-10 w-10">
                    <img
                      className="h-full w-full rounded-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">Steven Jobs</div>
                    <div className="text-gray-400">jobs@sailboatui.com</div>
                  </div>
                </th>
                <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                  Car Zone
                </td>

                <td className="px-6 lg:px-4 xl:px-0 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Active
                  </span>
                </td>

                <td className="px-6 lg:px-4 xl:px-0 py-4">Toronto, UK</td>
              </tr>
              <tr className="">
                <th className="px-6 lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                  <div className="relative h-10 w-10">
                    <img
                      className="h-full w-full rounded-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">Steven Jobs</div>
                    <div className="text-gray-400">jobs@sailboatui.com</div>
                  </div>
                </th>
                <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                  Car Zone
                </td>

                <td className="px-6 lg:px-4 xl:px-0 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 lg:px-4 xl:px-0 py-4">Toronto, UK</td>
              </tr>
              <tr className="">
                <th className="px-6 lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                  <div className="relative h-10 w-10">
                    <img
                      className="h-full w-full rounded-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">Steven Jobs</div>
                    <div className="text-gray-400">jobs@sailboatui.com</div>
                  </div>
                </th>
                <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                  Car Zone
                </td>

                <td className="px-6 lg:px-4 xl:px-0 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 lg:px-4 xl:px-0 py-4">Toronto, UK</td>
              </tr>
              <tr className="">
                <th className="px-6 lg:px-4 xl:px-0 flex gap-3  py-4 font-normal text-gray-900">
                  <div className="relative h-10 w-10">
                    <img
                      className="h-full w-full rounded-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">Steven Jobs</div>
                    <div className="text-gray-400">jobs@sailboatui.com</div>
                  </div>
                </th>
                <td className="px-6 lg:px-4 xl:px-0 py-4 font-medium">
                  Car Zone
                </td>

                <td className="px-6 lg:px-4 xl:px-0 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 lg:px-4 xl:px-0 py-4">Toronto, UK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
        <h1 className="ml-1 text-xl font-bold text-black">
          Packages And Plans
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-start items-start gap-4">
          <PackageCard />
          <PackageCard />
          <PackageCard />
          <PackageCard />
          <PackageCard />
        </div>
      </div>
    </div>
  );
};

export default DealershipsOtherDetails;
