import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Sidebar from '../src/components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Enquiries from './pages/Enquiries';
import Employee from './pages/Employee';
import { useUser } from './context/UserContext';

function App() {
  const { user, setUser } = useUser();

  function handleLogout() {
    setUser(null);
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Enquiries" element={<Signup />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex">
          <Sidebar onLogout={handleLogout} />
          <div className="ml-64 w-full p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/Enquiries" element={<Enquiries />} />
              <Route path="/Employee" element={<Employee />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
