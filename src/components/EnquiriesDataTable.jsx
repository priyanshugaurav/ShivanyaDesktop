import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CustomerDetailsDialog from '../components/CustomerDetailsDialog'

export default function SimpleDataTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Filters state
    const [filterModel, setFilterModel] = useState('');
    const [filterPincode, setFilterPincode] = useState('');
    const [filterVillage, setFilterVillage] = useState('');
    const [filterSalesman, setFilterSalesman] = useState('');
    // New filter: ExpectedDate range
    const [expectedDateFrom, setExpectedDateFrom] = useState('');
    const [expectedDateTo, setExpectedDateTo] = useState('');

    const [visibleColumns, setVisibleColumns] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

      const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

    const STORAGE_KEY = 'simpleTableVisibleColumnsV2';

    useEffect(() => {
        fetch(
            'https://script.google.com/macros/s/AKfycbyj_Neaejsx1BwgUS7WtcNK8yVmkxzmO-sdpVGGJhpXAzBT_yPrNVtPMFO6A5p5d-Y/exec'
        )
            .then((res) => res.json())
            .then((data) => {
                setData(data || []);
                const cols = data.length > 0 ? Object.keys(data[0]) : [];
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
                setVisibleColumns(stored?.length ? stored : cols);
            })
            .catch((err) => console.error('Fetch error:', err))
            .finally(() => setLoading(false));
    }, []);

    const toggleColumn = (col) => {
        const updated = visibleColumns.includes(col)
            ? visibleColumns.filter((c) => c !== col)
            : [...visibleColumns, col];
        setVisibleColumns(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Normalize keys for filters (lowercase all keys in row)
    const normalizeRow = (row) => {
        const normalized = {};
        for (const key in row) {
            normalized[key.toLowerCase()] = row[key];
        }
        return normalized;
    };

    // Unique values for dropdowns using lowercase keys
    const uniqueModels = [...new Set(data.map((d) => (d.Model || d.model) || '').filter(Boolean))];
    const uniquePincodes = [...new Set(data.map((d) => (d.Pincode || d.pincode) || '').filter(Boolean))];
    const uniqueVillages = [...new Set(data.map((d) => d.village || '').filter(Boolean))];
    const uniqueSalesmen = [...new Set(data.map((d) => (d.Salesman || d.salesman) || '').filter(Boolean))];

    // Helper to parse date safely (expects YYYY-MM-DD or any ISO format)
    const parseDate = (str) => {
        if (!str) return null;
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    };

      const openDialog = (customer) => {
        console.log(customer);
        setDialogOpen(false);
        
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  // Function to close dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

    // Filtering logic combining search + filters including ExpectedDate range
    const filteredData = data.filter((row) => {
        const r = normalizeRow(row);

        // Search across all string fields
        const matchesSearch = Object.values(row).some(
            (val) =>
                typeof val === 'string' &&
                val.toLowerCase().includes(search.toLowerCase())
        );

        const matchesModel = filterModel
            ? (r.model === filterModel.toLowerCase())
            : true;

        const matchesPincode = filterPincode
            ? (r.pincode === filterPincode.toLowerCase())
            : true;

        const matchesVillage = filterVillage
            ? (r.village === filterVillage.toLowerCase())
            : true;

        const matchesSalesman = filterSalesman
            ? (r.salesman === filterSalesman.toLowerCase())
            : true;

        // ExpectedDate filtering: assume row.ExpectedDate or row.expecteddate contains date string
        const rowExpectedDate = parseDate(r.expecteddate || r['expected date'] || '');
        const fromDate = parseDate(expectedDateFrom);
        const toDate = parseDate(expectedDateTo);

        let matchesExpectedDate = true;
        if (fromDate && rowExpectedDate) {
            matchesExpectedDate = rowExpectedDate >= fromDate;
        }
        if (matchesExpectedDate && toDate && rowExpectedDate) {
            matchesExpectedDate = rowExpectedDate <= toDate;
        }
        // If rowExpectedDate is null but filters are set, exclude it
        if ((fromDate || toDate) && !rowExpectedDate) {
            matchesExpectedDate = false;
        }

        return (
            matchesSearch &&
            matchesModel &&
            matchesPincode &&
            matchesVillage &&
            matchesSalesman &&
            matchesExpectedDate
        );
    });

    const allColumns = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="min-w-[77vw] max-w-[77vw] text-white p-6">
            {/* Filters and Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 items-center">

                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md max-w-md flex-grow"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md max-w-xs"
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                >
                    <option value="">All Models</option>
                    {uniqueModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md max-w-xs"
                    value={filterPincode}
                    onChange={(e) => setFilterPincode(e.target.value)}
                >
                    <option value="">All Pincodes</option>
                    {uniquePincodes.map((pin) => (
                        <option key={pin} value={pin}>{pin}</option>
                    ))}
                </select>

                <select
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md max-w-xs"
                    value={filterVillage}
                    onChange={(e) => setFilterVillage(e.target.value)}
                >
                    <option value="">All Villages</option>
                    {uniqueVillages.map((village) => (
                        <option key={village} value={village}>{village}</option>
                    ))}
                </select>

                <select
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md max-w-xs"
                    value={filterSalesman}
                    onChange={(e) => setFilterSalesman(e.target.value)}
                >
                    <option value="">All Salesmen</option>
                    {uniqueSalesmen.map((salesman) => (
                        <option key={salesman} value={salesman}>{salesman}</option>
                    ))}
                </select>

                {/* Expected Date From-To */}
                <input
                    type="date"
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md"
                    value={expectedDateFrom}
                    onChange={(e) => setExpectedDateFrom(e.target.value)}
                />
                {/* <span className="text-white">to</span> */}
                <input
                    type="date"
                    className="bg-zinc-800 text-white px-4 py-2 rounded-md"
                    value={expectedDateTo}
                    onChange={(e) => setExpectedDateTo(e.target.value)}
                />
                


                {/* Columns Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        Columns <ChevronDown size={16} />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 w-48 z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-zinc-800">
                            {allColumns.map((col) => (
                                <label
                                    key={col}
                                    className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-zinc-800 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col)}
                                        onChange={() => toggleColumn(col)}
                                        className="accent-blue-600"
                                    />
                                    <span className="capitalize">{col}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto relative max-h-[calc(85vh-230px)] border border-zinc-700 rounded">

                <table className="min-w-full bg-[#121212] table-auto relative">
                    <thead className="bg-zinc-900 text-zinc-200 text-sm sticky top-0 z-10">
                        <tr>
                            <th className="py-3 px-4 text-left sticky top-0 bg-zinc-900 z-30">#</th>
                            {visibleColumns.map((col) => (
                                <th key={col} className="py-3 px-4 text-left capitalize sticky top-0 bg-zinc-900 z-30">
                                    {col}
                                </th>
                            ))}
                            <th className="py-3 px-4 text-left whitespace-nowrap bg-zinc-900 sticky top-0 right-0 z-40">
                                Actions
                            </th>
                        </tr>
                    </thead>

    <tbody>
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 2}
                  className="text-center py-6 text-zinc-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="border-b border-zinc-700">
                  <td className="py-3 px-4">{index + 1}</td>
                  {visibleColumns.map((col) => {
                    const value = row[col] || '';
                    const isTruncated = value.length > 15;
                    const displayValue = isTruncated ? value.slice(0, 15) + '...' : value;

                    return (
                      <td
                        key={col}
                        className="py-3 px-4 relative group max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        <span className="block truncate" title={value}>
                          {displayValue}
                        </span>

                        {isTruncated && (
                          <div className="absolute z-50 hidden group-hover:block bg-zinc-900 text-white text-sm p-2 rounded-md shadow-xl w-max max-w-sm top-full mt-1 left-1 border border-zinc-700">
                            {value}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 whitespace-nowrap bg-[#121212] sticky right-0 z-20 border-l border-zinc-800">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      onClick={() => openDialog(row)}
                    >
                      Shift
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
                </table>
            </div>

            {dialogOpen && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          onClose={closeDialog}
          open={dialogOpen}
        />
      )}
        </div>
    );

}
