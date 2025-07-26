import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { updatePassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      newErrors.newPassword = 'Password must be between 8 and 16 characters';
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter and one special character';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await updatePassword(formData.currentPassword, formData.newPassword);
    
    if (result.success) {
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } else {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Password Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className={`form-input ${errors.currentPassword ? 'border-red-500' : ''}`}
                value={formData.currentPassword}
                onChange={handleChange}
              />
              {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
            </div>

            <div>
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className={`form-input ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="8-16 chars, 1 uppercase, 1 special character"
                value={formData.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordModal;
