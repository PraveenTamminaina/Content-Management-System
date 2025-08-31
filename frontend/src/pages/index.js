// src/pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProducts(
        res.data.filter((p) => p.status === "Published" && !p.is_deleted)
      );
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(true); // keep loading true so retry can happen
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      if (loading) fetchProducts(); // retry while loading
    }, 5000); // retry every 5 seconds
    return () => clearInterval(interval);
  }, [loading]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <Link href="/add">
        <button className="submit-btn">Add New Product</button>
      </Link>

      {loading && (
        <p>
          Loading products… Backend might be waking up on Render. This page will
          retry automatically.
        </p>
      )}

      {error && !loading && (
        <div>
          <p style={{ color: "red" }}>
            Could not reach backend. If it’s on Render, it might be sleeping.
            Try again.
          </p>
          <button className="submit-btn" onClick={fetchProducts}>
            Retry Now
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p.product_id}>
              <h3>{p.product_name}</h3>
              <p>{p.product_desc}</p>
              <p>Status: {p.status}</p>
              <div className="card-buttons">
                <Link href={`/edit/${p.product_id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.product_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
