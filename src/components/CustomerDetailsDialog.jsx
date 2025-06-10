import React, { useState } from 'react';

export default function CustomerDetailsDialog({ open, onClose, customer }) {
  const [formData, setFormData] = useState({
    fathersName: '',
    address: '',
    district: '',
    postOffice: '',
    policeStation: '',
    pincode: '',
    pan: '',
    aadhar: '',
    incentive: ''
  });

  if (!open) return null;

  const details = [
    { label: 'Name', key: 'Name' },
    { label: 'Village', key: 'village' },
    { label: 'Phone', key: 'Phone' },
    { label: 'Model', key: 'Model' },
    { label: 'Salesman', key: 'Salesman' },
  ];

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

const handleSubmit = async () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  try {
    // 1. Save customer details
    const resCustomer = await fetch('http://localhost:5000/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customer?.Name,
        village: customer?.village,
        phone: customer?.Phone,
        model: customer?.Model,
        salesman: customer?.Salesman,
        ...formData
      })
    });

    // 2. Save incentive to /incentives
    // const resIncentive = await fetch('http://localhost:5000/incentives', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     salesman: customer?.Salesman,
    //     incentive: parseFloat(formData.incentive || 0),
    //     month: currentMonth,
    //     year: currentYear
    //   })
    // });

    // 3. Add incentive under employee's salaryHistory
    const resSalaryIncentive = await fetch('http://localhost:5000/employees/incentive/by-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customer?.Salesman,
        month: currentMonth,
        year: currentYear,
        incentive: parseFloat(formData.incentive || 0),
        nameShifted: customer?.Name || 'Unknown',
        phoneShifted: customer?.Phone || ''
      })
    });
    

    onClose();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:text-red-400"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-3 overflow-y-auto flex-grow space-y-4 pr-2">
          {details.map(({ label, key }) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-zinc-400 mb-1">{label}</label>
              <input
                type="text"
                disabled
                value={customer?.[key] || ''}
                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded"
              />
            </div>
          ))}

          {[
            'fathersName',
            'address',
            'district',
            'postOffice',
            'policeStation',
            'pincode',
            'pan',
            'aadhar'
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm text-zinc-400 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-zinc-400 mb-1">Salesman</label>
              <input
                type="text"
                disabled
                value={customer?.Salesman || ''}
                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-zinc-400 mb-1">Incentive</label>
              <input
                type="number"
                value={formData.incentive}
                onChange={(e) => handleChange('incentive', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-zinc-700 bg-[#121212]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}