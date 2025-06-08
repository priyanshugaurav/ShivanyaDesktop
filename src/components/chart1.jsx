import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { date: "Apr 1", visitors1: 20, visitors2: 15 },
  { date: "Apr 5", visitors1: 40, visitors2: 30 },
  { date: "Apr 9", visitors1: 30, visitors2: 25 },
  { date: "Apr 13", visitors1: 60, visitors2: 50 },
  { date: "Apr 17", visitors1: 45, visitors2: 40 },
  { date: "Apr 21", visitors1: 70, visitors2: 60 },
  { date: "Apr 25", visitors1: 30, visitors2: 35 },
  { date: "Apr 29", visitors1: 80, visitors2: 70 },
  { date: "May 3", visitors1: 65, visitors2: 55 },
  { date: "May 7", visitors1: 95, visitors2: 85 },
  { date: "May 11", visitors1: 70, visitors2: 60 },
  { date: "May 15", visitors1: 50, visitors2: 45 },
  { date: "May 19", visitors1: 85, visitors2: 75 },
  { date: "May 23", visitors1: 40, visitors2: 35 },
  { date: "May 27", visitors1: 90, visitors2: 80 },
  { date: "Jun 1", visitors1: 55, visitors2: 50 },
  { date: "Jun 5", visitors1: 100, visitors2: 90 },
  { date: "Jun 9", visitors1: 80, visitors2: 70 },
  { date: "Jun 13", visitors1: 110, visitors2: 100 },
  { date: "Jun 17", visitors1: 95, visitors2: 85 },
  { date: "Jun 21", visitors1: 105, visitors2: 95 },
  { date: "Jun 25", visitors1: 115, visitors2: 105 },
  { date: "Jun 29", visitors1: 100, visitors2: 90 },
];

const VisitorsChart = () => {
  return (
    <div className=" text-white pt-10 p-2 rounded-xl shadow-lg w-full max-w-5xl">
      <h2 className="text-2xl font-semibold mb-1">Total Visitors</h2>
      <p className="text-sm text-gray-400 mb-4">Total for the last 3 months</p>
      <div className="flex space-x-4 mb-6">
        <button className="bg-gray-700 text-white py-1 px-3 rounded-md">Last 3 months</button>
        <button className="bg-gray-800 text-gray-400 py-1 px-3 rounded-md">Last 30 days</button>
        <button className="bg-gray-800 text-gray-400 py-1 px-3 rounded-md">Last 7 days</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVisitors2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: "#bbb" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} labelStyle={{ color: '#fff' }} />
          <Line type="monotone" dataKey="visitors1" stroke="#ffffff" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="visitors2" stroke="#4ade80" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorsChart;