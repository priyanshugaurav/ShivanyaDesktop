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
    tyre: false,
    mirror: false,
    front: false,
  });

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
        tyre: customer.challan.tyre || false,
        mirror: customer.challan.mirror || false,
        front: customer.challan.front || false,
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
        tyre: false,
        mirror: false,
        front: false,
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

  const checkboxes = ['tools', 'rear', 'tyre', 'mirror', 'front'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#121212] text-white rounded-lg w-full max-w-[400px] shadow-lg mx-4 max-h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">{isEditing ? 'Add Challan' : 'View Challan'}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="p-6 overflow-auto">
          {inputs.map((field, idx) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 text-sm capitalize" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                ref={idx === 0 ? firstInputRef : null}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-600 rounded"
              />
            </div>
          ))}

          {checkboxes.map(field => (
            <div key={field} className="mb-2 flex items-center">
              <input
                type="checkbox"
                name={field}
                checked={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="mr-2"
              />
              <label htmlFor={field} className="text-sm capitalize">{field}</label>
            </div>
          ))}
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
