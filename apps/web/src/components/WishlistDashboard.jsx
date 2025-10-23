import React, { useEffect, useState } from "react";
import { fetchWishlist, exportWishlist } from "../api/wishlistApi";

export default function WishlistDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchWishlist();
      setItems(data.items || data);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Deine Wunschliste</h2>
      <button
        onClick={exportWishlist}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Exportieren als CSV
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="p-4 border rounded shadow-sm">
            <h3 className="font-bold">{item.strain}</h3>
            {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
            <p className="text-xs text-gray-500">
              HinzugefÃƒÆ’Ã‚Â¼gt am {new Date(item.addedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
