import { useEffect, useState } from "react";
import {
  getProducts,
  saveProducts,
  getTransactions,
  saveTransactions
} from "../utils/storage";
import Dashboard from "../components/Dashboard";

export default function Transaction() {
  const [transactions, setTransaction] = useState([]);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("BUY");

  //LOAD SEMUA
  useEffect(() => {
    setProducts(getProducts());
    setTransaction(getTransactions());
  }, []);

  // SAVE TRANSACTIONS (TIDAK RESET)
  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  setProducts(getProducts());
  setTransaction(getTransactions());
  setIsLoaded(true);
}, []);

useEffect(() => {
  if (isLoaded) {
    saveTransactions(transactions);
  }
}, [transactions, isLoaded]);

  //ADD TRANSACTION
  const addTransaction = () => {
    if (!name || !amount || Number(amount) <= 0) {
      alert("Isi semua field dengan benar!");
      return;
    }

    const qty = Number(amount);
    const currentProducts = getProducts();

    let isValid = true;

    const updated = currentProducts.map(p => {
      if (p.name === name) {
        if (type === "SELL") {
          if (p.stock < qty) {
            alert("Stock tidak cukup!");
            isValid = false;
            return p;
          }
          return { ...p, stock: p.stock - qty };
        }
        return { ...p, stock: p.stock + qty };
      }
      return p;
    });

    if (!isValid) return;

    // 🔥 SAVE PRODUCT
    saveProducts(updated);
    setProducts(updated);

    // 🔥 SAVE TRANSACTION
    const newTx = {
      id: Date.now(),
      name,
      amount: qty,
      type,
      date: new Date().toLocaleString()
    };

    const updatedTx = [...transactions, newTx];

    setTransaction(updatedTx);
    saveTransactions(updatedTx); // 🔥 langsung save

    setName("");
    setAmount("");
  };

  return (
    <Dashboard>
      <h2>
        <i className="bi bi-archive-fill"></i> Transaction
      </h2>

      {/* ADD */}
      <div className="card">
        <h3>Add Transaction</h3>

        <div className="form-row">
          <select
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Pilih Product</option>
            {products.map(p => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Qty"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>

          <button className="button" onClick={addTransaction}>
            Add
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="card">
        <h3>Transaction History</h3>

        {transactions.length === 0 && (
          <p style={{ color: "#6B7280" }}>Belum ada transaksi</p>
        )}

        {[...transactions]
          .sort((a, b) => b.id - a.id)
          .map(t => (
            <div key={t.id} className="product-item">
              <div>
                <b>{t.name}</b>

                <div className="stock">
                  {t.type === "BUY" ? "🟢 Buy" : "🔴 Sell"} — {t.amount}
                </div>

                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {t.date}
                </div>
              </div>

              <span className={`badge ${t.type === "BUY" ? "safe" : "low"}`}>
                {t.type}
              </span>
            </div>
          ))}
      </div>
    </Dashboard>
  );
}