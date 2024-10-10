import React, { useState } from "react";
import { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    Dealers: 4000,
    Users: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    Dealers: 3000,
    Users: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    Dealers: 2000,
    Users: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    Dealers: 2780,
    Users: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    Dealers: 1890,
    Users: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    Dealers: 2390,
    Users: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    Dealers: 3490,
    Users: 4300,
    amt: 2100,
  },
];
const Summary = ({ dealers, users }) => {
  const [isActive, setIsActive] = useState("Users");
  return (
    <div className="w-full flex flex-col border rounded-xl gap-6">
      <div className="w-full h-72 p-4 flex flex-col justify-start items-start ">
        <div className="p-3 border-b w-full  mb-6 flex justify-between items-center">
          <p className="text-xl font-bold">{isActive} Analytics</p>
          <div className="w-auto flex gap-2 justify-start items-center">
            <button
              onClick={() => setIsActive("Users")}
              className={`w-24 h-8 text-sm font-medium rounded-full  ${
                isActive == "Users"
                  ? "bg-[#ff204e] text-white"
                  : "bg-gray-50 text-black"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setIsActive("Dealers")}
              className={`w-24 h-8 text-sm font-medium rounded-full  ${
                isActive == "Dealers"
                  ? "bg-[#ff204e] text-white"
                  : "bg-gray-50 text-black"
              }`}
            >
              Dealers
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={isActive == "Users" ? users : dealers}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={isActive == "Users" ? "users" : "dealers"}
              stroke="#ff204e"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Summary;
