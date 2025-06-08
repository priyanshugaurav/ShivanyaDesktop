
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import AddCustomerDialog from '../components/AddCustomerDialog';
import AddChallanDialog from '../components/AddChallanDialog';
import AddAgreementDialog from '../components/AddAgreementDialog';

export default function DataTable() {
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [challanOpen, setChallanOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const DEFAULT_HIDDEN_COLUMNS = ['_id', 'createdAt', 'email'];
  const [agreementOpen, setAgreementOpen] = useState(false);
  const STORAGE_KEY = 'visibleColumns';

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

  // Filter columns: exclude those where ANY customer has an object value for that key
  const baseColumns = Array.from(
    new Set(customers.flatMap(Object.keys))
  ).filter(col =>
    !customers.some(customer => typeof customer[col] === 'object' && customer[col] !== null)
  );

  // Add derived columns (like agreement.dues)
  const derivedColumns = ['dues'];
  const allColumns = [...baseColumns, ...derivedColumns];



  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      setVisibleColumns(parsed);
    } else {
      // Hide default hidden columns
      const filtered = allColumns.filter(col => !DEFAULT_HIDDEN_COLUMNS.includes(col));
      setVisibleColumns(filtered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  }, [customers.length]);

  const filteredData = customers.filter((row) =>
    Object.values(row).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };


  const handleAddCustomerClick = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);
  const handleSaveCustomer = (customerData) => {
    setCustomers((prev) => [...prev, customerData]);
    setIsDialogOpen(false);
  };

  // New handlers for the buttons per row
  const handleAddChallan = (customer) => {
    if (!customer || !customer._id) {
      console.error('Invalid customer:', customer);
      return;
    }
    setSelectedCustomer(customer);
    setChallanOpen(true);
  };

  const handleChallanClose = () => {
    setChallanOpen(false);
    setSelectedCustomer(null);
  };

  const handleChallanSave = (updatedCustomer) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(cust =>
        cust._id === updatedCustomer._id ? updatedCustomer : cust
      )
    );
    setChallanOpen(false);
    setSelectedCustomer(null);
  };


  const handleAddAgreement = (customer) => {
    setSelectedCustomer(customer);
    setAgreementOpen(true);
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
                      {col === 'dues'
                        ? row.agreement?.dues ?? '-'
                        : row[col]}
                    </td>
                  ))}

                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleAddChallan(row)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 rounded h-8 flex items-center justify-center whitespace-nowrap"
                    >
                      {row.challan && Object.keys(row.challan).length > 0 ? 'View Challan' : 'Add Challan'}
                      {/* Add Challan */}
                    </button>

                    <AddChallanDialog
                      open={challanOpen}
                      onClose={handleChallanClose}
                      onSave={handleChallanSave}
                      customer={selectedCustomer}
                    />
                    <button
                      onClick={() => handleAddAgreement(row)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded h-8 flex items-center justify-center whitespace-nowrap"
                    >
                      {row.agreement && Object.keys(row.agreement).length > 0 ? 'View Agreement' : 'Add Agreement'}
                    </button>



                    <AddAgreementDialog
                      open={agreementOpen}
                      onClose={() => {
                        setAgreementOpen(false);
                        setSelectedCustomer(null);
                      }}
                      onSave={(updatedCustomer) => {
                        setCustomers(prev =>
                          prev.map(c =>
                            c._id === updatedCustomer._id ? updatedCustomer : c
                          )
                        );
                        setAgreementOpen(false);
                        setSelectedCustomer(null);
                      }}
                      customer={selectedCustomer}
                    />

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
