"use client";

import { Bars3Icon } from '@heroicons/react/24/outline';

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="mb-8 flex items-center">
      <button onClick={onMenuClick} className="mr-4">
        <Bars3Icon className="h-8 w-8 text-gray-600" />
      </button>
      <h1 className="text-3xl font-bold text-gray-800">HR Professional Dashboard</h1>
    </header>
  );
};

export default DashboardHeader;