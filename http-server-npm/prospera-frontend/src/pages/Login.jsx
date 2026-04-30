import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    console.log("CLICK LOGIN");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      console.log("STATUS:", res.status);

      if (res.ok) {
        console.log("LOGIN SUCCESS");

        localStorage.setItem("isLogin", "true");
        nav("/products");

      } else {
        console.log("LOGIN FAILED");
        alert("Login gagal");
      }

    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">
        <h2>Welcome to Prospera</h2>
        <p className="subtitle">Ready to Prosper</p>

        <input className="input" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />

        <input className="input" placeholder="Password" type="password"
          value={password} onChange={e => setPassword(e.target.value)} />
          
        <div> 
          <button className="button" onClick={login}>
            Login
          </button>
        </div> 
      </div>
    </div>
  )};

const wrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh"
}