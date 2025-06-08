import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingDuesPopup({ open, onClose, customersWithDues, onSelectCustomer }) {
    if (!open) return null;

    const handleCopyAndSelect = (customer) => {
        navigator.clipboard.writeText(customer.phone);
        toast.success('Copied!', {
            position: 'bottom-center',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: 'dark',
        });
        onSelectCustomer(customer);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 overflow-auto"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-[#121212] text-white rounded-lg w-full max-w-[500px] shadow-lg mx-4 max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                    <h2 className="text-lg font-semibold">Pending Dues</h2>
                    <button onClick={onClose} className="text-2xl font-bold leading-none">&times;</button>
                </div>

                <div className="p-6 overflow-auto flex-grow">
                    {customersWithDues.length === 0 ? (
                        <p className="text-zinc-400 text-center">No customers with pending dues.</p>
                    ) : (
                        customersWithDues.map((customer) => (
                            <div
                                key={customer._id}
                                className="p-4 bg-zinc-800 rounded-md mb-3 hover:bg-zinc-700 transition-all cursor-pointer"
                                onClick={() => handleCopyAndSelect(customer)}
                            >
                                <h3 className="text-md font-medium">
                                    Name: {customer.name} | Phone: {customer.phone}
                                </h3>
                                <p className="text-sm text-zinc-400">Pending Amount: ₹{customer.agreement.dues}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
