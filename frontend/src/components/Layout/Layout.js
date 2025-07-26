import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PasswordModal from '../Common/PasswordModal';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Store Rating System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-600">Welcome,</span>
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700"
              >
                Change Password
              </button>
              
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;
