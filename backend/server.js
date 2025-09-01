const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test API
app.get("/", (req, res) => res.send("API Running"));

// Add product
app.post("/products", (req, res) => {
  const { product_name, product_desc, created_by, status } = req.body;
  const sql = `INSERT INTO Products (product_name, product_desc, created_by, status) VALUES (?, ?, ?, ?)`;
  db.query(
    sql,
    [product_name, product_desc, created_by, status],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Product added", productId: result.insertId });
    }
  );
});

// Get all (non-deleted) products
app.get("/products", (req, res) => {
  const sql = `SELECT * FROM Products WHERE is_deleted=FALSE`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ✅ Get only published products
app.get("/products/published", (req, res) => {
  const sql = `SELECT * FROM Products WHERE status="Published" AND is_deleted=FALSE`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ✅ Get only draft products
app.get("/products/drafts", (req, res) => {
  const sql = `SELECT * FROM Products WHERE status="Draft" AND is_deleted=FALSE`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get single product
app.get("/products/:id", (req, res) => {
  const sql = "SELECT * FROM Products WHERE product_id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
});

// Update product
app.put("/products/:id", (req, res) => {
  const { product_name, product_desc, updated_by, status } = req.body;
  const sql = `
        UPDATE Products
        SET product_name=?, product_desc=?, updated_by=?, status=?, updated_at=NOW()
        WHERE product_id=?
    `;
  db.query(
    sql,
    [product_name, product_desc, updated_by, status, req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ message: "Product updated" });
    }
  );
});

// Soft delete product
app.delete("/products/:id", (req, res) => {
  const { updated_by } = req.body;
  const sql = `
        UPDATE Products
        SET is_deleted=TRUE, updated_by=?, updated_at=NOW()
        WHERE product_id=?
    `;
  db.query(sql, [updated_by, req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Product deleted (soft delete)" });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
