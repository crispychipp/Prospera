import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { getProducts } from "../utils/storage";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getProducts());
  }, []);

  return (
    <Dashboard>
      <h2>⚠ Inventory Alert</h2>

      {items.length === 0 && (
        <p style={{ color: "#6B7280" }}>Belum ada data</p>
      )}

      {items.map((i) => {
        const low = i.stock < 10;

        return (
          <div
            key={i.id}
            className="card"
            style={{
              borderLeft: `6px solid ${low ? "#EF4444" : "#22C55E"}`
            }}
          >
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