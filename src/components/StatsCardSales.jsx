import React from 'react';

const StatsCardSales = ({ label = "downPayment", amount = "₹130", percent = "+160.0%" }) => {
  const isPositive = parseFloat(percent) >= 0;

  return (
    <div className="bg-zinc-900 text-white rounded-xl p-4 w-[240px] shadow-md border border-zinc-800">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">Total<br /><span className="text-white">{label}</span></div>
        <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>
          {isPositive ? '↑' : '↓'} {percent}
        </span>
      </div>
      <div className="text-2xl font-semibold">{amount}</div>
    </div>
  );
};

export default StatsCardSales;
