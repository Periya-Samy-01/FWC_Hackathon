
"use client";

import { useState, useEffect } from 'react';

const CompanySettingsPage = () => {
  const [settings, setSettings] = useState({
    companyName: '',
    logoUrl: '',
    geminiApiKeyIsSet: false,
  });
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: settings.companyName,
          logoUrl: settings.logoUrl,
        }),
        credentials: 'include',
      });
      // Optionally, provide feedback to the user, e.g., a toast notification
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to update general settings', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Company Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        {/* General Settings Card */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <form onSubmit={handleGeneralSubmit}>
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300">
                Company Logo URL
              </label>
              <input
                type="text"
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save General Settings
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CompanySettingsPage;
