
"use client";

import { useState, useEffect } from 'react';
import AuditLogTable from '@/app/components/admin/AuditLogTable';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    actorName: '',
  });

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.actorName) params.append('actorName', filters.actorName);

      const res = await fetch(`/api/audit-events?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Audit Log</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            name="actorName"
            placeholder="Search by actor name..."
            value={filters.actorName}
            onChange={handleFilterChange}
            className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  );
};

export default AuditLogPage;
