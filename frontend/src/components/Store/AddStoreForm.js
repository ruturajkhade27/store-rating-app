import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { storeAPI } from '../../utils/api';

const AddStoreForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [owners, setOwners] = useState([]);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await userAPI.getUsers({ role: 'STORE_OWNER' });
        setOwners(res.data.users || []);
      } catch (err) {
        console.error('Error fetching store owners:', err);
      }
    }

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      store: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: parseInt(formData.ownerId),
      },
    };

    try {
      await storeAPI.createStore(payload);
      alert('Store created successfully!');
      onSuccess();
    } catch (err) {
      console.error('Error creating store:', err.response?.data || err);
      alert('Failed to create store');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Create Store</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Store Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Store Email</label>
            <input
              type="email"
              name="email"
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
            <label className="form-label">Store Owner</label>
            <select
              name="ownerId"
              required
              className="form-input"
              value={formData.ownerId}
              onChange={handleChange}
            >
              <option value="">Select Owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreForm;
