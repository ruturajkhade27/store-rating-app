import React from 'react';

const StoreTable = ({ stores }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-2">Stores</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Owner</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="px-4 py-2 font-medium">{store.name}</td>
              <td className="px-4 py-2">{store.address}</td>
              <td className="px-4 py-2">{store.owner?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
