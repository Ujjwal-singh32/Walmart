// app/products/page.jsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err) {
        console.error(err);
        setError('Server error while fetching products');
      }
    }

    fetchProducts();
  }, []);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.productId} className="border p-4 rounded-lg shadow-sm hover:shadow-md">
              <Link href={`/product/${product.productId}`}>
                <div>
                  <img
                    src={product.images?.[0] || '/no-image.png'}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">₹{product.basePrice}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
