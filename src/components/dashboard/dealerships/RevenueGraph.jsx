import React from "react";
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
    uv: 4000,
    Revenue: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    Revenue: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    Revenue: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    Revenue: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    Revenue: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    Revenue: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    Revenue: 4300,
    amt: 2100,
  },
];
const RevenueGraph = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
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
          dataKey="Revenue"
          stroke="#ff204e"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueGraph;
