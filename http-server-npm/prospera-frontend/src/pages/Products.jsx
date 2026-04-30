import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { getProducts, saveProducts } from "../utils/storage";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  // LOAD SETIAP MASUK PAGE
  useEffect(() => {
    const load = () => {
      setProducts(getProducts());
    };

    load();

    window.addEventListener("focus", load);

    return () => window.removeEventListener("focus", load);
  }, []);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const addProduct = () => {
    if (!name || !stock) return alert("Isi semua field");

    const newProduct = {
      id: Date.now(),
      name,
      stock: Number(stock)
    };

    const updated = [...products, newProduct];

    setProducts(updated);
    saveProducts(updated); // 🔥 langsung save juga

    setName("");
    setStock("");
  };

  return (
    <Dashboard>
      <div className="card">
        <h2>📦 Product Management</h2>

        <div className="card">
          <h3>Add Product</h3>

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

            <button className="button" onClick={addProduct}>
              Add
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Daftar Produk</h3>

          {products.map(p => (
            <div key={p.id} className="product-item">
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