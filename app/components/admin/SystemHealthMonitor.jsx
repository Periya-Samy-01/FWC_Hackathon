
"use client";

import { useState, useEffect } from 'react';
import { ClockIcon, CircleStackIcon } from '@heroicons/react/24/outline';

const SystemHealthMonitor = () => {
  const [status, setStatus] = useState({
    database: 'Loading...',
    aiService: 'Loading...',
    activeSessions: 'Loading...',
  });

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const res = await fetch('/api/admin/system-status', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          throw new Error('Failed to fetch system status');
        }
      } catch (error) {
        console.error(error);
        setStatus({
          database: 'Error',
          aiService: 'Error',
          activeSessions: 'Error',
        });
      }
    };

    fetchSystemStatus();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Error') return 'text-red-500';
    if (status === 'Connected' || status === 'Operational') return 'text-green-500';
    return 'text-gray-300';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <CircleStackIcon className="h-6 w-6 mr-2" />
          Database Status
        </h3>
        <p className={`text-2xl font-bold ${getStatusColor(status.database)}`}>
          {status.database}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ClockIcon className="h-6 w-6 mr-2" />
          Active Sessions
        </h3>
        <p className="text-2xl font-bold text-gray-300">{status.activeSessions}</p>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
