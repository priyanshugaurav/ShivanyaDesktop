import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddEmployeeDialog from '../components/AddEmployeeDialog'; // <- Import here
import AttendanceList from '../components/AttendanceList'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', salary: '', phone: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employees');
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/employees', formData);
      setShowDialog(false);
      setFormData({ name: '', salary: '', phone: '' });
      fetchEmployees();
      toast.success("Employee Added Successfull");
    } catch (err) {
      console.error('Error saving employee:', err);
      toast.error('Error saving employee:', err);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-[87vh] min-w-[77vw]">
      {showDialog && (
        <AddEmployeeDialog
          onClose={() => setShowDialog(false)}
          onSave={handleSave}
          formData={formData}
          onChange={handleChange}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="bg-zinc-800 text-white px-4 py-2 rounded w-1/3 focus:outline-none"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* Employee Table remains unchanged */}
      {/* ... */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm bg-zinc-800 rounded">
          <thead className="bg-zinc-700 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Attendance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={emp._id} className="border-b border-zinc-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{emp.name || '-'}</td>
                <td className="px-4 py-2">{emp.phone || '-'}</td>
                <td className="px-4 py-2">
  ₹{emp.salary || 0}
  {emp.salaryHistory?.length > 0 && (() => {
    const latest = emp.salaryHistory[emp.salaryHistory.length - 1];
    const incentiveArray = Array.isArray(latest.incentive) ? latest.incentive : [];
    const totalIncentive = incentiveArray.reduce((sum, i) => sum + (i.amount || 0), 0);
    return (
      <span className="text-xs text-green-400 ml-1">
        (+₹{totalIncentive})
      </span>
    );
  })()}
</td>

                <td className="px-4 py-2">{emp.attendanceDetails?.length || 0} Days</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
                    View Salary
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                    View Attendance
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-zinc-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AttendanceList url="https://script.google.com/macros/s/AKfycbyj_Neaejsx1BwgUS7WtcNK8yVmkxzmO-sdpVGGJhpXAzBT_yPrNVtPMFO6A5p5d-Y/exec?type=attendance&month=2025-06" />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
