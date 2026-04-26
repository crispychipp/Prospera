import { useEffect, useState } from "react";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/inventory")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Inventory Alert</h2>

      {items.map((item, i) => (
        <div key={i}>
          {item.name} - Stock: {item.stock}
          <span style={{ color: "red" }}> ⚠ Low Stock</span>
        </div>
      ))}
    </div>
  );
}