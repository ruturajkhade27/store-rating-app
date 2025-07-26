import React, { useEffect, useState } from 'react';
import { storeAPI } from '../../utils/api';

const StoreDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    storeAPI.getOwnerDashboard().then(res => {
      setStore(res.data.store);
      setRatings(res.data.ratings);
    });
  }, []);

  if (!store) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{store.name} - Dashboard</h2>
      <p>📍 {store.address}</p>
      <p>⭐ Average Rating: {store.averageRating}</p>
      <h3 className="text-lg font-semibold mt-6">User Ratings</h3>
      <ul className="mt-2 space-y-2">
        {ratings.map((r) => (
          <li key={r.id} className="border p-3 rounded bg-gray-50">
            <p><strong>{r.user.name}</strong> ({r.user.email})</p>
            <p>Rating: {r.rating} ⭐</p>
            <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreDashboard;
