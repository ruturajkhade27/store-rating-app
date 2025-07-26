import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one special character';
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

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
    </div>
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter your full name (20-60 characters)"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows="3"
            className={`form-input ${errors.address ? 'border-red-500' : ''}`}
            placeholder="Enter your address (max 400 characters)"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="form-error">{errors.address}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={`form-input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="8-16 chars, 1 uppercase, 1 special character"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  </div>
</div>

  );
};

export default Register;
