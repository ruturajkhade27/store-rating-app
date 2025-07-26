import React, { useEffect, useState } from 'react';
import { storeAPI, ratingAPI } from '../../utils/api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await storeAPI.getStores({ search });
      setStores(res.data.stores);
    } catch (err) {
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (storeId, value) => {
    try {
      await ratingAPI.submitRating({ storeId, rating: value });
      fetchStores();
    } catch {
      alert('Failed to submit rating');
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Browse & Rate Stores</h2>

      <input
        type="text"
        placeholder="Search by name or address"
        className="form-input mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading stores...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
            <div key={store.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.address}</p>
                  <p className="text-sm text-gray-600">
                    ⭐ Average: {store.averageRating} ({store.totalRatings} ratings)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleRating(store.id, num)}
                    className={`star ${store.userRating >= num ? 'filled' : 'empty'}`}
                    title={`Rate ${num}`}
                  >
                    ★
                  </button>
                ))}
                {store.userRating && (
                  <span className="text-sm text-gray-500 ml-2">
                    Your rating: {store.userRating}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
