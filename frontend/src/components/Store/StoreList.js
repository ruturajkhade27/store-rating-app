import React, { useEffect, useState } from 'react';
import { storeAPI, ratingAPI } from '../../utils/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      const res = await storeAPI.getStores();
      setStores(res.data.stores);
    } catch (err) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRatingChange = async (storeId, value) => {
    try {
      await ratingAPI.submitRating({ storeId, rating: value });
      fetchStores(); // refresh rating
    } catch {
      alert('Failed to submit rating');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {stores.map((store) => (
        <div key={store.id} className="card">
          <h3 className="text-xl font-bold">{store.name}</h3>
          <p className="text-gray-600">{store.address}</p>
          <p>Average Rating: {store.averageRating} ⭐</p>
          <div className="flex space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleRatingChange(store.id, num)}
                className={`px-2 py-1 border rounded ${store.userRating === num ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                {num}
              </button>
            ))}
            {store.userRating && (
              <span className="text-sm text-gray-500 ml-2">Your Rating: {store.userRating}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreList;
