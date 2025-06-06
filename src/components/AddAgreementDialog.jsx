import React, { useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';

export default function AddAgreementDialog({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    onroadprice: '',
    payment: '',
    loanamount: '',
    bpf: '',
    downpayment: '',
    dues: '',
    netprofit: '',
    margin: '',
    paymentType: '',
    paymentDate: '',
    registerationAmount: '',
    permit: '',
    onlinepayment: '',
    totalpayment: '',
    remarks: ['']
  });

  const [isEditing, setIsEditing] = useState(true);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open && firstInputRef.current) firstInputRef.current.focus();

    if (open && customer?.agreement) {
      setFormData({
        onroadprice: customer.agreement.onroadprice || '',
        payment: customer.agreement.payment || '',
        loanamount: customer.agreement.loanamount || '',
        bpf: customer.agreement.bpf || '',
        downpayment: customer.agreement.downpayment || '',
        dues: customer.agreement.dues || '',
        netprofit: customer.agreement.netprofit || '',
        margin: customer.agreement.margin || '',
        paymentType: customer.agreement.paymentType || '',
        paymentDate: customer.agreement.paymentDate || '',
        registerationAmount: customer.agreement.registerationAmount || '',
        permit: customer.agreement.permit || '',
        onlinepayment: customer.agreement.onlinepayment || '',
        totalpayment: customer.agreement.totalpayment || '',
        remarks: customer.agreement.remarks || ['']
      });
      setIsEditing(false);
    } else if (open) {
      setFormData({
        onroadprice: '',
        payment: '',
        loanamount: '',
        bpf: '',
        downpayment: '',
        dues: '',
        netprofit: '',
        margin: '',
        paymentType: '',
        paymentDate: '',
        registerationAmount: '',
        permit: '',
        onlinepayment: '',
        totalpayment: '',
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
      const response = await fetch(`http://localhost:5000/customers/${customer._id}/agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    'onroadprice', 'payment', 'loanamount', 'bpf', 'downpayment',
    'dues', 'netprofit', 'margin', 'registerationAmount', 'permit',
    'onlinepayment', 'totalpayment'
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Add Agreement Details</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {inputs.map((name, idx) => (
            <div key={name}>
              <label className="block text-sm capitalize mb-1">{name.replace(/([A-Z])/g, ' $1')}</label>
              <input
                ref={idx === 0 ? firstInputRef : null}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 rounded text-white"
                disabled={!isEditing}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1">Payment Type</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 rounded text-white"
              disabled={!isEditing}
            >
              <option value="">Select type</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="loan">Loan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 rounded text-white"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Remarks</label>
            {formData.remarks.map((remark, index) => (
              <input
                key={index}
                value={remark}
                onChange={(e) => handleRemarkChange(index, e.target.value)}
                className="w-full mb-2 px-3 py-2 bg-zinc-800 rounded text-white"
                disabled={!isEditing}
              />
            ))}
            {/* {isEditing && ( */}
              <button onClick={addRemark} className="text-blue-400 text-sm">+ Add Remark</button>
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
    </div>
  );
}
