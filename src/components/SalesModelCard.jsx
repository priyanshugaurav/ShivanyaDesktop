import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SalesModelCard = ({ data }) => {
  // Example data fallback
  const models = data || [
    { name: 'Model X1', count: 12 },
    { name: 'Model Z3', count: 9 },
    { name: 'Model A7', count: 6 },
    { name: 'Model A7', count: 6 },
    { name: 'Model A7', count: 6 },
    { name: 'Model A7', count: 6 },
    { name: 'Model A10', count: 6 },
    { name: 'Model A9', count: 6 },
    { name: 'Model A8', count: 6 },
    { name: 'Model A7', count: 6 },
  ];

  const total = models.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="bg-zinc-900 border-zinc-800 border text-white rounded-xl p-6 shadow-md w-full max-w-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-zinc-400">Sales by Model</p>
          <h2 className="text-3xl font-bold mt-1 mb-3 ">{total}</h2>
          <p
                    className={`text-[16px] font-medium flex items-center gap-1 ${
                      true ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    something
                    {true ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </p>
        </div>

        <div className="bg-green-900 text-green-400 px-2 py-1 text-sm rounded-full flex items-center gap-1 font-medium">
          <ArrowUpRight size={14} />
          +12.5%
        </div>
      </div>

<div className="mt-6 max-h-70 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
  {models.map((item, index) => (
    <div
      key={index}
      className="p-3 flex justify-between items-center text-sm border-b border-zinc-800 pb-1 last:border-none mb-2"
    >
      <span className="text-zinc-300">{item.name}</span>
      <span className="font-medium text-white">{item.count}</span>
    </div>
  ))}
</div>

    </div>
  );
};

export default SalesModelCard;