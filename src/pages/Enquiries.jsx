import React from 'react'
import { useUser } from '../context/UserContext'
import DataTable from '../components/EnquiriesDataTable' // Adjust the import path as necessary
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Sales = () => {
  
  const { user } = useUser();
  return (
    <div className="mb-6 flex flex-col items-start justify-center gap-2 max-h-[87vh] mt-5">
      <h1 className="text-4xl font-bold text-white-800 mt-10 ml-6">
        Enquiries, <span className="text-violet-700">Data</span>!
      </h1>
      <p className="text-sm text-gray-500 mt-1 ml-7">
        We’re glad to have you back. Explore your Enquiries below.
      </p>

      <DataTable/>
            <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        theme="dark"
        style={{ zIndex: 99999 }}
      />
    </div>
  );

}

export default Sales