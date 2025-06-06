import React, { useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';

export default function AddChallanDialog({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    challanNo: '',
    vehicleNo: '',
    keyNo: '',
    batteryNo: '',
  });

  // New state to track if form is editable
  const [isEditing, setIsEditing] = useState(true);

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    if (open && customer?.challan) {
      setFormData({
        challanNo: customer.challan.challanNo || '',
        vehicleNo: customer.challan.vehicleNo || '',
        keyNo: customer.challan.keyNo || '',
        batteryNo: customer.challan.batteryNo || '',
      });
      // Disable editing if challan exists
      setIsEditing(false);
    } else if (open) {
      setFormData({
        challanNo: '',
        vehicleNo: '',
        keyNo: '',
        batteryNo: '',
      });
      // Enable editing if no challan exists
      setIsEditing(true);
    }
  }, [open, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!customer || !customer._id) {
      toast.error("Customer ID is missing. Cannot save challan.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/customers/${customer._id}/challan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Challan added successfully!', {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        onSave(data.customer);
        onClose();
      } else {
        toast.error(data.error || 'Failed to add challan.', {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Unexpected error occurred.', {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });
    }
  };

  if (!open) return null;

  const inputs = [
    { label: 'Challan No.', name: 'challanNo' },
    { label: 'Vehicle No.', name: 'vehicleNo' },
    { label: 'Key No.', name: 'keyNo' },
    { label: 'Battery No.', name: 'batteryNo' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#121212] text-white rounded-lg w-full max-w-[400px] shadow-lg mx-4 max-h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Add Challan Details</h2>
          <button onClick={onClose} className="text-white text-xl hover:text-red-400">&times;</button>
        </div>

        <p className="px-6 pt-4 text-sm text-zinc-400 mb-2">Enter challan details below.</p>

        <form
          className="px-6 py-3 overflow-y-auto flex-grow space-y-6"
          onSubmit={e => { e.preventDefault(); handleSave(); }}
          style={{ scrollbarWidth: 'thin' }}
        >
          {inputs.map(({ label, name }, idx) => (
            <div key={name} className="relative mt-4">
              <input
                ref={idx === 0 ? firstInputRef : null}
                type="text"
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder=" "
                className="
                  peer w-full px-3 pt-5 pb-2 rounded-md bg-[#1f1f1f] text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                autoComplete="off"
                disabled={!isEditing}  // disable if not editing
              />
              <label
                htmlFor={name}
                className={`
                  absolute left-3 text-zinc-400 text-sm transition-all duration-200
                  pointer-events-none
                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-500
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400
                  ${formData[name] ? 'top-1 text-xs text-blue-400' : 'top-2.5'}
                `}
              >
                {label}
              </label>
            </div>
          ))}
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-zinc-700 bg-[#121212]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md"
          >
            Cancel
          </button>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md"
            >
              Edit
            </button>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-zinc-200"
            >
              Save Challan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
