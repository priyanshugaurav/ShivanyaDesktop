import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCustomerDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    fathersName: '',
    address: '',
    villageName: '',
    district: '',
    postOffice: '',
    policeStation: '',
    pincode: '',
    phone: '',
    pan: '',
    aadhar: '',
    email: '',
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok && data.success) {
        toast.success('Customer added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
        onSave(data.customer); // Pass the new customer data to the parent
        // Don't close dialog automatically, so no onClose() here
      } else {
        toast.error(data.error || 'Failed to add customer.', {
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

  const inputs =  [
  { label: 'Name', name: 'name' },
  { label: 'Village', name: 'village' },
  { label: "Father's Name", name: 'fathersName' },
  { label: 'Address', name: 'address' },
  { label: 'Village Name', name: 'villageName' },
  { label: 'District', name: 'district' },
  { label: 'Post Office', name: 'postOffice' },
  { label: 'Police Station', name: 'policeStation' },
  { label: 'Pincode', name: 'pincode' },
  { label: 'Phone', name: 'phone' },
  { label: 'PAN Card', name: 'pan' },
  { label: 'Aadhar', name: 'aadhar' },
];


  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[700px] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-zinc-700">
            <h2 className="text-lg font-semibold">Add Customer</h2>
            <button onClick={onClose} className="text-white text-xl hover:text-red-400">&times;</button>
          </div>

          <p className="px-6 pt-4 text-sm text-zinc-400 mb-2">Enter customer details below.</p>

          <form
            className="px-6 py-3 overflow-y-auto flex-grow space-y-6"
            onSubmit={e => { e.preventDefault(); handleSave(); }}
            style={{ scrollbarWidth: 'thin' }}
          >
            {inputs.map(({ label, name }, idx) => {
              const hasValue = formData[name].length > 0;
              return (
                <div key={name} className="relative mt-4">
  <input
    ref={idx === 0 ? firstInputRef : null}
    type="text"
    name={name}
    id={name}
    value={formData[name]}
    onChange={handleChange}
    placeholder=" "
    className={`
      peer w-full px-3 pt-5 pb-2 rounded-md bg-[#1f1f1f] text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
    `}
    autoComplete="off"
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

              );
            })}
          </form>

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
              onClick={handleSave}
              className="px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-zinc-200"
            >
              Save Customer
            </button>
          </div>
        </div>
      </div>

      {/* Toast container for showing toasts */}
    </>
  );
}
