import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import UserTable from './UserTable';
import CreateUserModal from './CreateUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, sortOrder, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        ...filters
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await userAPI.getUsers(params);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleCreateUser = async (formData) => {
    try {
      await userAPI.createUser(formData); 
      fetchUsers(); 
      setShowCreateModal(false);
      alert("User Created Successfully.")
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Search by email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by address"
              value={filters.address}
              onChange={(e) => handleFilterChange('address', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UserTable
          users={users}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
