import React, { useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';

export default function AddAgreementDialog({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    onroadprice: '',
    loanAmount: '',
    bankProcessingFee: '',
    downPayment: '',
    dues: '',
    magadhMargin: '',
    registerationAmount: '',
    permit: '',
    onlinePayment: '',
    totatDTOPayment: '',
    netprofit: '',
    paymentType: '',
    paymentDate: '',
    remarks: ['']
  });

  const [isEditing, setIsEditing] = useState(true);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open && firstInputRef.current) firstInputRef.current.focus();

    if (open && customer?.agreement) {
      const ag = customer.agreement;
      setFormData({
        onroadprice: ag.onroadprice || '',
        loanAmount: ag.loanAmount || '',
        bankProcessingFee: ag.bankProcessingFee || '',
        downPayment: ag.downPayment || '',
        dues: ag.dues || '',
        magadhMargin: ag.magadhMargin || '',
        registerationAmount: ag.registerationAmount || '',
        permit: ag.permit || '',
        onlinePayment: ag.onlinePayment || '',
        totatDTOPayment: ag.totatDTOPayment || '',
        netprofit: ag.netprofit || '',
        paymentType: ag.paymentType || '',
        paymentDate: ag.paymentDate || '',
        remarks: ag.remark || ['']
      });
      setIsEditing(false);
    } else if (open) {
      setFormData({
        onroadprice: '',
        loanAmount: '',
        bankProcessingFee: '',
        downPayment: '',
        dues: '',
        magadhMargin: '',
        registerationAmount: '',
        permit: '',
        onlinePayment: '',
        totatDTOPayment: '',
        netprofit: '',
        paymentType: '',
        paymentDate: '',
        remarks: ['']
      });
      setIsEditing(true);
    }
  }, [open, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemarkChange = (index, value) => {
    const updated = [...formData.remarks];
    updated[index] = value;
    setFormData(prev => ({ ...prev, remarks: updated }));
  };

  const addRemark = () => {
    setFormData(prev => ({ ...prev, remarks: [...prev.remarks, ''] }));
  };

  const handleSave = async () => {
    if (!customer || !customer._id) {
      toast.error("Customer ID is missing. Cannot save agreement.");
      return;
    }

    try {
      const { remarks, ...rest } = formData;

      const response = await fetch(`http://localhost:5000/customers/${customer._id}/agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          remark: remarks,  // send as `remark` to match backend
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Agreement saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        onSave(data.customer);
        onClose();
      } else {
        toast.error(data.error || 'Failed to save agreement.', {
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
    'onroadprice',
    'loanAmount',
    'bankProcessingFee',
    'downPayment',
    'dues',
    'magadhMargin',
    'registerationAmount',
    'permit',
    'onlinePayment'
  ];

return (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-zinc-700">
        <h2 className="text-lg font-semibold">Add Agreement Details</h2>
        <button onClick={onClose} className="text-xl text-white">&times;</button>
      </div>
      <div className="p-6 space-y-4">

        {/* Regular Fields */}
        {[
          'onroadprice',
          'loanAmount',
          'bankProcessingFee',
          'downPayment',
          'dues',
          'magadhMargin'
        ].map((field, idx) => (
          <div key={field} className="flex items-center gap-4">
            <label className="w-40 capitalize text-sm text-zinc-400">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              ref={idx === 0 ? firstInputRef : null}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none"
            />
          </div>
        ))}

        {/* DTO Section */}
        <div className="mt-6">
          <h3 className="text-blue-400 font-semibold mb-2">DTO Section</h3>
          {['registerationAmount', 'permit', 'onlinePayment'].map((field) => (
            <div key={field} className="flex items-center gap-4 mb-2">
              <label className="w-40 capitalize text-sm text-zinc-400">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Auto-calculated */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm text-zinc-400">Total DTO Payment</label>
            <input
              name="totatDTOPayment"
              value={formData.totatDTOPayment}
              disabled
              className="flex-1 px-3 py-2 bg-zinc-900 text-white rounded-md"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm text-zinc-400">Net Profit</label>
            <input
              name="netprofit"
              value={formData.netprofit}
              disabled
              className="flex-1 px-3 py-2 bg-zinc-900 text-white rounded-md"
            />
          </div>
        </div>

        {/* Payment Type */}
        <div className="flex items-center gap-4 mt-4">
          <label className="w-40 text-sm text-zinc-400">Payment Type</label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            disabled={!isEditing}
            className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md"
          >
            <option value="">Select type</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="loan">Loan</option>
          </select>
        </div>

        {/* Payment Date */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-sm text-zinc-400">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            disabled={!isEditing}
            className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md"
          />
        </div>

        {/* Remarks */}
        <div className="mt-4">
          <label className="text-sm text-zinc-400 mb-1 block">Remarks</label>
          {formData.remarks.map((remark, idx) => (
            <input
              key={idx}
              value={remark}
              onChange={(e) => handleRemarkChange(idx, e.target.value)}
              disabled={!isEditing}
              className="w-full mb-2 px-3 py-2 bg-zinc-800 text-white rounded-md"
            />
          ))}
          {isEditing && (
            <button onClick={addRemark} className="text-blue-400 text-sm mt-1">+ Add Remark</button>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700 mt-6">
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
              Save Agreement
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);


}
