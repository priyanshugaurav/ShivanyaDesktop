import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, isSameDay, parseISO } from 'date-fns';

const AttendanceList = ({ url }) => {
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(url); // should include ?type=attendance&month=YYYY-MM
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setData(sorted);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    fetchAttendance();
  }, [url]);

  const names = Array.from(new Set(data.map(entry => entry.name)));

const filteredData = data.filter(entry => {
  const timestamp = parseISO(entry.timestamp);
  const matchesDate = !selectedDate || isSameDay(timestamp, selectedDate);
  const matchesName = selectedName === 'All' || entry.name === selectedName;
  return matchesDate && matchesName;
});


  return (
    <div className="p-4  text-white rounded-lg shadow-md mt-10">
      {/* Header with left title and right filters */}
      <div className="flex justify-between items-center mb-7 flex-wrap gap-2">
        {/* Left: Title */}
        <h2 className="text-xl font-semibold">📅 Attendance</h2>

        {/* Right: Filters */}
        <div className="flex gap-4 items-center">
          {/* 📅 Calendar Picker */}
          <div>
            {/* <label className="text-sm text-gray-400 mr-1">Date:</label> */}
            <input
  type="date"
  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
  onChange={(e) =>
    setSelectedDate(e.target.value ? new Date(e.target.value) : null)
  }
  className="bg-zinc-800 text-white border border-zinc-700 px-3 py-1 rounded focus:outline-none"
/>

          </div>

          {/* 👤 Name Dropdown */}
          <div>
            {/* <label className="text-sm text-gray-400 mr-1">Employee:</label> */}
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="bg-zinc-800 text-white border border-zinc-700 px-3 py-1 rounded focus:outline-none"
            >
              <option value="All">All</option>
              {names.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Marked Today Box */}
      {/* ✅ Only today's attendance for green dots */}
{data.some(entry => isSameDay(parseISO(entry.timestamp), new Date())) ? (
  <div className="flex flex-wrap items-center gap-4 mb-6">
    {data
      .filter(entry => isSameDay(parseISO(entry.timestamp), new Date()))
      .map((entry, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block"></span>
          <span className="font-medium text-sm">{entry.name}</span>
          <span className="text-xs text-gray-400">
            {format(new Date(entry.timestamp), 'hh:mm a')}
          </span>
        </div>
      ))}
  </div>
) : (
  <p className="text-gray-400 mb-6">No attendance marked today.</p>
)}


      {/* 📋 Scrollable List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredData.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded">
            <div>
              <p className="font-medium">{entry.name}</p>
              <p className="text-sm text-gray-400">
                {format(new Date(entry.timestamp), 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
            <span className="text-sm text-gray-500">{entry.location || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceList;
