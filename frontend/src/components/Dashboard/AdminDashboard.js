import React, { useState, useEffect } from 'react';
import { userAPI, storeAPI } from '../../utils/api';
import StatsCards from '../Common/StatsCards';
import UserManagement from '../Admin/UserManagement';
import StoreManagement from '../Admin/StoreManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'stores', label: 'Store Management' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <StatsCards stats={stats} />
            )}
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'stores' && <StoreManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
