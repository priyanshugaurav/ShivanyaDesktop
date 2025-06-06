import React, { useState } from 'react';
import { Home, User, Code, Pencil, LineChart, ShoppingCart, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // adjust path as needed

const menuItems = [
  { icon: <Home size={18} />, label: 'Home', count: 1, to: '/' },
  { icon: <User size={18} />, label: 'Sales', count: 2, to: '/sales' },
  { icon: <Code size={18} />, label: 'Projects', count: 3 },
  { icon: <Pencil size={18} />, label: 'Writing', count: 4 },
  { icon: <LineChart size={18} />, label: 'Investments', count: 5 },
];

const resourceItems = [
  { icon: <Users size={18} />, label: 'Talent', count: 9 },
  { icon: <ShoppingCart size={18} />, label: 'Boutique', count: 6 },
];

export default function Sidebar() {
  const { user, logout } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`
        fixed left-0 top-0 h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white p-4
        flex flex-col justify-between
        transition-width duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div>
        {/* Logo/Title */}
        <div className={`text-2xl font-bold mb-10 text-center ${isCollapsed ? 'hidden' : 'block'}`}>
          ShivAnya
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, i) => {
            const content = (
              <div
                className={`flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer transition`}
                title={isCollapsed ? item.label : undefined} // show tooltip when collapsed
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-md">{item.count}</span>
                )}
              </div>
            );

            return item.to ? (
              <Link to={item.to} key={i} className="no-underline text-white block">
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </nav>

        {/* Resources Header */}
        {!isCollapsed && (
          <div className="mt-10 mb-4 text-sm text-gray-400 uppercase tracking-wide flex items-center justify-between">
            <span>Resources</span>
          </div>
        )}

        {/* Resources */}
        <nav className="space-y-2 mt-2">
          {resourceItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer transition"
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-md">{item.count}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div>
        {/* Collapse / Expand button */}
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full mb-3 py-2 rounded bg-gray-800 hover:bg-gray-700 transition text-white"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          type="button"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Logout button */}
        {!isCollapsed && (
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold transition"
            type="button"
          >
            Logout
          </button>
        )}

        {/* Optional small text when expanded */}
        {!isCollapsed && (
          <div className="text-xs text-gray-500 mt-6 text-center">Stay in touch</div>
        )}
      </div>
    </div>
  );
}
