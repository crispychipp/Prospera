import { useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Transaction() {
  const [transactions, setTransaction] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addTransaction = () => {
    const newTx = {
      id: Date.now(),
      name,
      amount: Number(amount)
    };

    setTransaction([...transactions, newTx]);
    setName("");
    setAmount("");
  };

  return (
    <Dashboard>
      <h2> <i className="bi bi-archive-fill"></i> Transaction</h2>

      <div className="card">
        <input className="input"
          placeholder="Product / Item"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input className="input"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <button className="button" onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {transactions.map(t => (
          <div key={t.id} className="card" style={{ marginBottom: 10 }}>
            <b>{t.name}</b>
            <div>Rp {t.amount}</div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
}