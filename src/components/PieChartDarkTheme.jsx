import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ADE80", "#60A5FA", "#F87171", "#FACC15", "#A78BFA"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 rounded-lg text-white shadow-xl text-xs">
        <p>{`${payload[0].name}`}</p>
        <p className="font-semibold">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const PieChartDarkTheme = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="text-white p-6 rounded-2xl shadow-md w-full max-w-xl mx-auto bg-zinc-900 border border-zinc-800">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Financial Distribution</h2>
        <p className="text-sm text-gray-400">Overview of current fiscal allocations.</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartDarkTheme;
