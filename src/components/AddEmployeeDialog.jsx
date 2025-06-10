import React from 'react';

const AddEmployeeDialog = ({ onClose, onSave, formData, onChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] text-white w-[400px] rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Add Employee</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-red-500">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              type="text"
              placeholder="Enter name"
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Salary</label>
            <input
              name="salary"
              value={formData.salary}
              onChange={onChange}
              type="number"
              placeholder="Enter salary"
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              type="tel"
              placeholder="Enter phone number"
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
          >
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeDialog;
