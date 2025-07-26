import React, { useState } from 'react';

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onCreate === 'function') {
      onCreate(formData);
      onClose();
    } else {
      console.warn('onCreate is not a function');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              required
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-input"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
