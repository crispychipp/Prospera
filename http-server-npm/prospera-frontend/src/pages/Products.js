import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        products.map((p, i) => (
          <div key={i}>
            {p.name} - Stock: {p.stock}
          </div>
        ))
      )}
    </div>
  );
}