import React from "react";

const data = [
  {
    month: "January",
    netProfit: 18000,
    gross: 25000,
    margin: "72%",
    target: 30000,
    limit: 20000,
    reviewer: "Eddie Lake",
    status: "In Process",
  },
  {
    month: "February",
    netProfit: 29000,
    gross: 32000,
    margin: "91%",
    target: 35000,
    limit: 27000,
    reviewer: "Eddie Lake",
    status: "Done",
  },
  {
    month: "March",
    netProfit: 10000,
    gross: 15000,
    margin: "67%",
    target: 20000,
    limit: 18000,
    reviewer: "Eddie Lake",
    status: "Done",
  },
  {
    month: "April",
    netProfit: 27000,
    gross: 30000,
    margin: "90%",
    target: 35000,
    limit: 33000,
    reviewer: "Jamik Tashpul",
    status: "Done",
  },
  {
    month: "May",
    netProfit: 2000,
    gross: 5000,
    margin: "40%",
    target: 10000,
    limit: 8000,
    reviewer: "Jamik Tashpul",
    status: "In Process",
  },
  {
    month: "June",
    netProfit: 21000,
    gross: 26000,
    margin: "81%",
    target: 30000,
    limit: 29000,
    reviewer: "Jamik Tashpul",
    status: "In Process",
  },
];

const statusColor = (status) => {
  return status === "Done" ? "text-green-400 bg-green-900/30" : "text-yellow-300 bg-yellow-900/30";
};

const MonthlyTable = () => {
  return (
    <div className=" text-white p-1 pt-10 rounded-xl shadow-lg w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl mb-2 font-semibold">Monthly Overview</h2>
        <p className="text-gray-400 text-sm">Detailed report of monthly performance including profit, gross revenue, and margins.</p>
      </div>
      <table className="w-full text-sm mt-10">
        <thead className="border-b border-gray-700 text-left">
          <tr>
            <th className="p-3">Month</th>
            <th className="p-3">Net Profit</th>
            <th className="p-3">Gross</th>
            <th className="p-3">Margin</th>
            <th className="p-3">Target</th>
            <th className="p-3">Limit</th>
            <th className="p-3">Reviewer</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/40">
              <td className="p-3">{item.month}</td>
              <td className="p-3">${item.netProfit.toLocaleString()}</td>
              <td className="p-3">${item.gross.toLocaleString()}</td>
              <td className="p-3">{item.margin}</td>
              <td className="p-3">{item.target}</td>
              <td className="p-3">{item.limit}</td>
              <td className="p-3">{item.reviewer}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyTable;
