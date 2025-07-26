import React, { useEffect, useState } from 'react';
import { storeAPI } from '../../utils/api'; 
import AddStoreForm from '../../components/Store/AddStoreForm'; 
import StoreTable from '../../components/Store/StoreTable';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await storeAPI.getStores();
      setStores(res.data.stores || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Store Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Add New Store
        </button>
      </div>

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <StoreTable stores={stores} /> 
      )}

      {showModal && (
        <AddStoreForm
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchStores();
          }}
        />
      )}
    </div>
  );
};

export default StoreManagement;
