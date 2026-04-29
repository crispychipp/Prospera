import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const role = localStorage.getItem("role");

  const fetchData = () => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(fetchData, []);

  const addProduct = async () => {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, stock: Number(stock) })
    });

    setName("");
    setStock("");
    fetchData();
  };
  {role === "admin" && (
    <button
      style={{ marginLeft: 10 }}
      onClick={() => deleteProduct(p.id)}
    >
      Delete
    </button>
  )}

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  return (
    <Dashboard>
      <div className="card">
        <h2>Product Management</h2>

        <div className="form-row">
          <input
            className="input"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button className="button">Add</button>
        </div>
        <div className="card">
        <h3>Daftar Produk</h3>

        {products.map((p, i) => (
          <div className="product-item" key={i}>
            
            <div>
              <b>{p.name}</b>
              <div className="stock">Stock: {p.stock}</div>
            </div>

            <span className={p.stock < 10 ? "badge low" : "badge safe"}>
              {p.stock < 10 ? "Low" : "Safe"}
            </span>

          </div>
        ))}
      </div>
      </div>
    </Dashboard>
  );
}