"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AddGoalModal from '../../components/dashboard/employee/AddGoalModal';
import RequestLeaveModal from '../../components/dashboard/employee/RequestLeaveModal';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [isRequestLeaveModalOpen, setRequestLeaveModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/employee');
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleAddGoal = async (newGoal) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newGoal, employeeId: data.user._id, managerId: data.user.manager }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add goal');
      }

      await fetchDashboardData(); // Refetch all dashboard data to show the new goal
      setAddGoalModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleRequestLeave = async (leaveRequest) => {
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveRequest),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit leave request');
      }

      await fetchDashboardData(); // Refetch all dashboard data to show the new goal
      setRequestLeaveModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const result = await res.json();

      // Update the user's photoUrl in the local state
      setData(prevData => ({
        ...prevData,
        user: {
          ...prevData.user,
          profile: {
            ...prevData.user.profile,
            photoUrl: result.photoUrl
          }
        }
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };


  const { user, announcements } = data;

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user.name}!</h1>
          </div>
          <div className="flex-grow text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Employee Dashboard</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* My Profile Card */}
          <div className="text-center">
            <img
              key={user?.profile?.photoUrl}
              src={user?.profile?.photoUrl || "https://i.imgur.com/6VBx3io.png"}
              alt="Employee"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.jobTitle}</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-4 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Change Picture'}
            </button>
          </div>

          {/* Leave Balance Widget */}
          <div>
            <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
            <div className="flex justify-around space-x-2">
              <div className="bg-gray-800 rounded-lg p-4 text-center w-full">
                <p className="text-3xl font-bold">{user.leaveBalances.annual}</p>
                <p className="text-gray-400">Annual</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center w-full">
                <p className="text-3xl font-bold">{user.leaveBalances.sick}</p>
                <p className="text-gray-400">Sick</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={() => setRequestLeaveModalOpen(true)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Leave
            </button>
            <Link href="/dashboard/employee/payslips" passHref>
              <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                View Payslips
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-8">
          {/* Company Announcements */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Company Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="border-b border-gray-700 pb-2">
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p className="text-gray-400">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Performance Goals */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Performance Goals</h2>
                <button
                  onClick={() => setAddGoalModalOpen(true)}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Goal
                </button>
            </div>
            <div className="space-y-4">
              {user?.performanceGoals?.map((goal) => (
                <div key={goal._id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        goal.status === "Completed"
                          ? "bg-green-500 text-green-100"
                          : goal.status === "Active"
                          ? "bg-blue-500 text-blue-100"
                          : goal.status === "Pending Approval"
                          ? "bg-yellow-500 text-yellow-100"
                          : "bg-red-500 text-red-100"
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
      <RequestLeaveModal
        isOpen={isRequestLeaveModalOpen}
        onClose={() => setRequestLeaveModalOpen(false)}
        onSubmit={handleRequestLeave}
      />
    </>
  );
};

export default EmployeeDashboard;