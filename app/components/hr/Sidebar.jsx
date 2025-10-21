"use client";

import { XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div>
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold">More Options</h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul>
              <li className="mb-2">
                <a href="/dashboard/hr/directory" className="text-blue-500 hover:underline">Employee Directory</a>
              </li>
              <li className="mb-2">
                <a href="/dashboard/hr/manage-salary" className="text-blue-500 hover:underline">Manage Salary</a>
              </li>
              <li className="mb-2">
                <a href="/dashboard/hr/skills-roles-management" className="text-blue-500 hover:underline">Skills & Roles Management</a>
              </li>
              <li className="mb-2">
                <a href="/dashboard/hr/analytics" className="text-blue-500 hover:underline">Analytics & Insights</a>
              </li>
              <li>
                <a href="#" className="text-blue-500 hover:underline">HR Reports</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
