import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AddProduct() {
  const [product_name, setProductName] = useState("");
  const [product_desc, setProductDesc] = useState("");
  const [status, setStatus] = useState("Draft");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        product_name,
        product_desc,
        created_by: "admin",
        status,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={product_name}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <textarea
          placeholder="Product Description"
          value={product_desc}
          onChange={(e) => setProductDesc(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Draft</option>
          <option>Published</option>
          <option>Archived</option>
        </select>
        <button className="submit-btn" type="submit">
          Add Product
        </button>
      </form>
      <Link href="/">
        <button className="submit-btn" style={{ marginTop: "10px" }}>
          Back to Products
        </button>
      </Link>
    </div>
  );
}
