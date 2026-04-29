import { Link, useLocation } from "react-router-dom";

export default function Dashboard({ children }) {
  const loc = useLocation();

  const menu = [
    { path: "/products", label: "Products", icon: "bi-box" },
    { path: "/inventory", label: "Inventory", icon: "bi-exclamation-triangle" },
    { path: "/transaction", label: "Transactions", icon: "bi-archive-fill" }
  ];

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "240px",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to bottom, var(--blue-primary), var(--green-primary))",
        color: "white"
      }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="bi bi-stack" style={{ fontSize: "24px" }}></i>
          Prospera BI
        </h2>

        {menu.map(m => (
          <Link
            key={m.path}
            to={m.path}
            style={{
              display: "block",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "8px",
              background: loc.pathname === m.path
                ? "rgba(255,255,255,0.2)"
                : "transparent",
              color: "white",
              textDecoration: "none"
            }}
          >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <i className={`bi ${m.icon}`}></i>
            <span>{m.label}</span>
          </div>
          </Link>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "30px" }}>
        {children}
      </div>

    </div>
  );
}