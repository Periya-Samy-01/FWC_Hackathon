"use client";
import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AIAssistant from '../../components/AIAssistant';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <AIAssistant />
    </div>
  );
}