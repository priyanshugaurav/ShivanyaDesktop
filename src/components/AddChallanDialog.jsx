import React, { useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';

export default function AddChallanDialog({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    challanNo: '',
    vehicleNo: '',
    keyNo: '',
    batteryNo: '',
    modelno: '',
    DTO: '',
    ONE: '',
    color: '',
    productNo: '',
    frameNo: '',
    engineNo: '',
    bookNo: '',
    cylinderNo: '',
    motorNo: '',
    tools: false,
    rear: false,
    tyreMakeFront: false,
    mirror: false,
  });

  const [isEditing, setIsEditing] = useState(true);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open && firstInputRef.current) firstInputRef.current.focus();

    if (open && customer?.challan) {
      setFormData({
        challanNo: customer.challan.challanNo || '',
        vehicleNo: customer.challan.vehicleNo || '',
        keyNo: customer.challan.keyNo || '',
        batteryNo: customer.challan.batteryNo || '',
        modelno: customer.challan.modelno || '',
        DTO: customer.challan.DTO || '',
        ONE: customer.challan.ONE || '',
        color: customer.challan.color || '',
        productNo: customer.challan.productNo || '',
        frameNo: customer.challan.frameNo || '',
        engineNo: customer.challan.engineNo || '',
        bookNo: customer.challan.bookNo || '',
        cylinderNo: customer.challan.cylinderNo || '',
        motorNo: customer.challan.motorNo || '',
        tools: customer.challan.tools || false,
        rear: customer.challan.rear || false,
        tyreMakeFront: customer.challan.tyreMakeFront || false,
        mirror: customer.challan.mirror || false,
      });
      setIsEditing(false);
    } else if (open) {
      setFormData({
        challanNo: '',
        vehicleNo: '',
        keyNo: '',
        batteryNo: '',
        modelno: '',
        DTO: '',
        ONE: '',
        color: '',
        productNo: '',
        frameNo: '',
        engineNo: '',
        bookNo: '',
        cylinderNo: '',
        motorNo: '',
        tools: false,
        rear: false,
        tyreMakeFront: false,
        mirror: false,
      });
      setIsEditing(true);
    }
  }, [open, customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    'challanNo', 'vehicleNo', 'keyNo', 'batteryNo',
    'modelno', 'DTO', 'ONE', 'color', 'productNo',
    'frameNo', 'engineNo', 'bookNo', 'cylinderNo', 'motorNo'
  ];

  const checkboxes = ['tools', 'rear', 'tyreMakeFront', 'mirror'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">{isEditing ? 'Add Challan' : 'View Challan'}</h2>
          <button onClick={onClose} className="text-2xl font-bold leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-auto flex-grow">
          {inputs.map((field, idx) => (
            <div key={field} className="flex items-center gap-4 mb-4">
              <label
                htmlFor={field}
                className="w-40 text-sm text-zinc-400 capitalize"
              >
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                ref={idx === 0 ? firstInputRef : null}
                type="text"
                id={field}
                name={field}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md border border-zinc-600 placeholder:text-zinc-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="mt-8 flex flex-wrap gap-6">
            {checkboxes.map(field => (
              <div key={field} className="flex items-center cursor-pointer select-none min-w-[150px]">
                <input
                  type="checkbox"
                  id={field}
                  name={field}
                  checked={!!formData[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mr-3 h-6 w-6 cursor-pointer"
                />
                <label
                  htmlFor={field}
                  className="text-base capitalize cursor-pointer whitespace-nowrap"
                >
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
              </div>
            ))}
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
