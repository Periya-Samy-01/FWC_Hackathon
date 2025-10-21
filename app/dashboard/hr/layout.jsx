"use client";

import { useState } from 'react';
import DashboardHeader from '../../components/hr/DashboardHeader';
import Sidebar from '../../components/hr/Sidebar';
import AIAssistant from '../../components/AIAssistant';

export default function HRLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-8">
        <DashboardHeader onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main>{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}