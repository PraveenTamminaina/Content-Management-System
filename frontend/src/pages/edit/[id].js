import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product_name, setProductName] = useState("");
  const [product_desc, setProductDesc] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const p = res.data;
        setProductName(p.product_name);
        setProductDesc(p.product_desc);
        setStatus(p.status);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.isReady, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        product_name,
        product_desc,
        status,
        updated_by: "editor",
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;

  return (
    <div className="container">
      <h1>Edit Product</h1>
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
          Update Product
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
