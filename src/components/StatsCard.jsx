import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({
  title = 'Total Revenue',
  value = '$1,250.00',
  trendText = 'Trending this month',
  percentage = '+12.5%',
  subtitle = 'Visitors for the last 6 months',
  trendingUp = true,
}) {
  return (
    <div className="bg-zinc-900 text-white rounded-xl p-6 min-w-[260px] max-w-sm shadow-md border border-zinc-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            trendingUp ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
          }`}
        >
          {trendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{percentage}</span>
        </div>
      </div>
      <div className="mt-4">
        <p
          className={`text-sm font-medium flex items-center gap-1 ${
            trendingUp ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {trendText}
          {trendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </p>
        <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
