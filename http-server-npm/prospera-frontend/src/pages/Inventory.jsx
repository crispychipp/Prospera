import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  const addProduct = async () => {
    if (!name || !stock) {
      alert("Isi semua field!");
      return;
    }

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, stock: Number(stock) })
    });

    console.log("STATUS:", res.status);

    if (res.ok) {
      alert("Berhasil tambah");

      setName("");
      setStock("");

      const data = await fetch("http://localhost:5000/products")
        .then(res => res.json());

      setItems(data);

    } else {
      alert("Gagal tambah");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <Dashboard>
      <h2>⚠ Inventory Alert</h2>
        <div className="card">
          <h3>Add Inventory</h3>

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

      {items.map((i, index) => {
        const low = i.stock < 10;

        return (
          <div className="card" style={{
            borderLeft: `6px solid ${low ? "#EF4444" : "#22C55E"}`
            }}>
            <b>{i.name}</b>
            <div>Stock: {i.stock}</div>

            {low && (
              <div style={{ color: "red", marginTop: 5 }}>
                ⚠ Restock Needed
              </div>
            )}
          </div>
        );
      })}
    </Dashboard>
  );
}