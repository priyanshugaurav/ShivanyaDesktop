import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();
   const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate('/'); // Already logged in
    }
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      const now = new Date();
      const expiry = now.getTime() + 12 * 60 * 60 * 1000; // 12 hours
      const sessionData = { user: data.user, expiry };

      localStorage.setItem('userSession', JSON.stringify(sessionData));
      login(data.user); // context update
      navigate('/');
    } else {
      setError(data.error || 'Login failed');
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left: 60% Image with dark overlay */}
      <div className="w-[60%] hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1558627563-3e383cddc94a?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h1 className="text-4xl font-semibold">Welcome Back</h1>
          <p className="text-gray-300 mt-2">Enter your details to access your account.</p>
        </div>
      </div>

      {/* Right: 40% Login Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-[#121212]">
        <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl p-10 shadow-2xl border border-[#2a2a2a]">
          <h2 className="text-3xl font-semibold mb-8 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-[#3a3a3a] hover:bg-[#444] transition text-white font-medium py-3 rounded-md"
            >
              Sign In
            </button>
          </form>
          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-gray-200 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
