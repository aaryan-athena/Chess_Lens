import { useNavigate } from "react-router-dom";

interface AppNavbarProps {
  title: string;
  subtitle?: string;
}

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#818cf8" strokeWidth="2.5"/>
    <circle cx="20" cy="20" r="11" stroke="#818cf8" strokeWidth="2"/>
    <circle cx="20" cy="20" r="4" fill="#818cf8"/>
    <line x1="20" y1="2" x2="20" y2="8" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="20" y1="32" x2="20" y2="38" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="2" y1="20" x2="8" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="20" x2="38" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="15" y="6" width="10" height="4" rx="2" fill="#818cf8"/>
  </svg>
);

const AppNavbar = ({ title, subtitle }: AppNavbarProps) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "0 1.25rem",
      height: "56px",
      flexShrink: 0,
      background: "rgba(10,10,15,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      gap: "1rem",
    }}>
      {/* Brand — click to go home */}
      <button
        onClick={() => navigate("/")}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "none", border: "none", cursor: "pointer", padding: "0.3rem 0.6rem",
          borderRadius: "8px", transition: "background 0.2s",
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.9rem", fontWeight: 600,
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}
      >
        <Logo />
        <span style={{ color: "#fff" }}>ChessLens</span>
      </button>

      {/* Divider */}
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.2rem", fontWeight: 300 }}>/</span>

      {/* Page title */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{title}</span>
        {subtitle && (
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{subtitle}</span>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Quick nav */}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {[
          { label: "Upload", path: "/upload" },
          { label: "Record", path: "/record" },
          { label: "Replay", path: "/replay" },
        ].map(({ label, path }) => {
          const isActive = window.location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "7px",
                border: isActive ? "1px solid rgba(129,140,248,0.5)" : "1px solid rgba(255,255,255,0.1)",
                background: isActive ? "rgba(79,70,229,0.2)" : "transparent",
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.55)",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppNavbar;
