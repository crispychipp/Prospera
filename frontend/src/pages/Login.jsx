import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setAuthSession } from "../utils/api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const login = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setAuthSession(data.token, data.user);
        nav("/dashboard");
      } else {
        const error = await res.json().catch(() => ({}));
        setMessage(error.message || "Login gagal");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Terjadi kesalahan koneksi ke server.");
    }
  };

  const register = async () => {
    setMessage("");
    
    if (!username || !email || !password || !confirmPassword) {
      setMessage("Semua kolom harus diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, email, password })
      });

      if (res.ok) {
        setMessage("Akun berhasil dibuat! Silakan login.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setIsRegister(false), 1500);
      } else {
        const error = await res.json().catch(() => ({}));
        setMessage(error.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome to Prospera</h2>
        <p className="subtitle">Ready to Prosper</p>

        {message && (
          <div style={{ 
            padding: "10px", 
            borderRadius: "5px", 
            marginBottom: "12px", 
            background: message.includes("berhasil") || message.includes("dibuat") ? "#D1FAE5" : "#FEE2E2", 
            color: message.includes("berhasil") || message.includes("dibuat") ? "#065F46" : "#991B1B", 
            textAlign: "center", 
            fontSize: "14px" 
          }}>
            {message}
          </div>
        )}

        {isRegister ? (
          <>
            <input className="input" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)} />
            <input className="input" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Password" type="password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <input className="input" placeholder="Konfirmasi Password" type="password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            
            <div> 
              <button className="button" onClick={register}>
                Register
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
              Sudah punya akun? <button style={{ background: "none", border: "none", color: "var(--blue-medium)", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsRegister(false); setMessage(""); }}>Login di sini</button>
            </p>
          </>
        ) : (
          <>
            <input className="input" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Password" type="password"
              value={password} onChange={e => setPassword(e.target.value)} />
              
            <div> 
              <button className="button" onClick={login}>
                Login
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
              Belum punya akun? <button style={{ background: "none", border: "none", color: "var(--blue-medium)", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsRegister(true); setMessage(""); }}>Daftar di sini</button>
            </p>
          </>
        )}
      </div>
    </div>
  )};
