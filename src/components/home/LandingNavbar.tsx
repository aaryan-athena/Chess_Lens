import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className={`landing-navbar${scrolled ? " scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo */}
      <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => scrollTo("hero")}>
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#818cf8" strokeWidth="2.5"/>
          <circle cx="20" cy="20" r="11" stroke="#818cf8" strokeWidth="2"/>
          <circle cx="20" cy="20" r="4" fill="#818cf8"/>
          <line x1="20" y1="2" x2="20" y2="8" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="20" y1="32" x2="20" y2="38" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="2" y1="20" x2="8" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32" y1="20" x2="38" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="15" y="6" width="10" height="4" rx="2" fill="#818cf8"/>
        </svg>
        <span>ChessLens</span>
      </div>

      {/* Nav links — scroll anchors */}
      <ul className="navbar-links d-none d-md-flex">
        <li><a href="#features"    onClick={e => { e.preventDefault(); scrollTo("features"); }}>Features</a></li>
        <li><a href="#how-it-works" onClick={e => { e.preventDefault(); scrollTo("how-it-works"); }}>How it works</a></li>
        <li><a href="#get-started" onClick={e => { e.preventDefault(); scrollTo("get-started"); }}>Get started</a></li>
      </ul>

      {/* CTA — direct page links */}
      <div className="navbar-cta">
        <button className="btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
          onClick={() => navigate("/replay")}>
          Replay
        </button>
        <button className="btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
          onClick={() => navigate("/upload")}>
          Upload
        </button>
        <button className="btn-primary-glow" style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
          onClick={() => navigate("/record")}>
          Start Recording
        </button>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;
