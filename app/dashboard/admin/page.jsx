"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserManagementTable from '../../components/UserManagementTable';
import RoleDistributionChart from '../../components/RoleDistributionChart';
import SystemHealthMonitor from '../../components/admin/SystemHealthMonitor';
import KpiCard from '../../components/KpiCard';

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const kpiData = [
    { title: 'Total Users', value: users.length },
    { title: 'Active Sessions', value: '56' },
    { title: 'Database Status', value: 'Online', status: 'Online' },
    { title: 'API Health', value: 'Online', status: 'Online' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">System Administrator Dashboard</h1>
        <div>
          <Link
            href="/dashboard/admin/audit-log"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors mr-4"
          >
            Audit Log
          </Link>
          <Link
            href="/dashboard/admin/company-settings"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors mr-4"
          >
            Company Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <SystemHealthMonitor />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} title={kpi.title} value={kpi.value} status={kpi.status} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <UserManagementTable users={users} refreshUsers={fetchUsers} />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Role Distribution</h2>
          <RoleDistributionChart users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;