import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import AddCustomerDialog from '../components/AddCustomerDialog';

export default function DataTable() {
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.customers);
        } else {
          console.error('Failed to fetch customers');
        }
      })
      .catch((err) => console.error('Error fetching customers:', err))
      .finally(() => setLoading(false));
  }, []);

  const allColumns = Array.from(
    new Set(customers.flatMap((item) => Object.keys(item)))
  );

  useEffect(() => {
    setVisibleColumns(allColumns);
  }, [customers.length]);

  const filteredData = customers.filter((row) =>
    Object.values(row).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleColumn = (col) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleAddCustomerClick = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);
  const handleSaveCustomer = (customerData) => {
    setCustomers((prev) => [...prev, customerData]);
    setIsDialogOpen(false);
  };

  // New handlers for the buttons per row
  const handleAddChallan = (customer) => {
    // Implement your logic here
    alert(`Add Challan clicked for ${customer.email || 'unknown customer'}`);
  };

  const handleAddAgreement = (customer) => {
    // Implement your logic here
    alert(`Add Agreement clicked for ${customer.email || 'unknown customer'}`);
  };

  const skeletonRows = Array.from({ length: 5 }).map((_, idx) => (
    <tr key={idx} className="bg-[#121212] border-b border-zinc-800 animate-pulse">
      <td className="py-3 px-4">
        <div className="h-4 w-4 bg-zinc-700 rounded"></div>
      </td>
      {visibleColumns.map((col) => (
        <td key={col} className="py-3 px-4">
          <div className="h-4 bg-zinc-700 rounded max-w-[80px]"></div>
        </td>
      ))}
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-zinc-700 rounded"></div>
          <div className="h-6 w-20 bg-zinc-700 rounded"></div>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="min-w-[76vw] max-w-[76vw] text-white pt-6 rounded-lg">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1f1f1f] text-white px-4 py-2 rounded-md w-full max-w-md focus:outline-none focus:ring"
          disabled={loading}
        />

        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={handleAddCustomerClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            disabled={loading}
          >
            <Plus size={16} />
            Add Customer
          </button>

          {/* Column Visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColumnsMenu((prev) => !prev)}
              className="bg-[#1f1f1f] hover:bg-zinc-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              Columns <ChevronDown size={16} />
            </button>
            {showColumnsMenu && (
              <div className="absolute z-30 top-full mt-2 right-0 bg-[#1f1f1f] border border-zinc-700 rounded-lg shadow-xl p-3 w-52 max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-zinc-900">
                {allColumns.map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-3 text-sm py-2 px-2 rounded cursor-pointer hover:bg-zinc-800 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                      className="h-4 w-4 text-blue-600 rounded border-zinc-700 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="capitalize">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="overflow-auto max-h-[calc(100vh-230px)] rounded-lg border border-zinc-800">
        <table className="min-w-full bg-[#121212]">
          <thead className="bg-zinc-900 text-white text-sm sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              {visibleColumns.map((col) => (
                <th key={col} className="py-3 px-4 text-left capitalize">{col}</th>
              ))}
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center text-zinc-400 py-6">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="bg-[#121212] border-b border-zinc-800">
                  <td className="py-3 px-4">{idx + 1}</td>
                  {visibleColumns.map((col) => (
                    <td key={col} className="py-3 px-4">
                      {row[col]}
                    </td>
                  ))}
                  <td className="py-3 px-4 flex gap-2">
                   <button
  onClick={() => handleAddChallan(row)}
  className="bg-green-600 hover:bg-green-700 text-white px-3 rounded h-8 flex items-center justify-center whitespace-nowrap"
>
  Add Challan
</button>
<button
  onClick={() => handleAddAgreement(row)}
  className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded h-8 flex items-center justify-center whitespace-nowrap"
>
  Add Agreement
</button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      <AddCustomerDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveCustomer}
      />
    </div>
  );

}
