import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChessBoardPreview = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    style={{
      width: "min(340px, 90vw)",
      aspectRatio: "1",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 40px 120px rgba(79,70,229,0.3)",
      background: "#1a1a2e",
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gridTemplateRows: "repeat(8, 1fr)",
    }}
  >
    {Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isLight = (row + col) % 2 === 0;
      return (
        <div
          key={i}
          style={{
            background: isLight ? "rgba(129,140,248,0.15)" : "rgba(129,140,248,0.04)",
          }}
        />
      );
    })}
  </motion.div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-glow" />
      <div className="hero-grid" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hero-badge"
      >
        <span>✦</span>
        <span>AI-Powered Chess Analysis</span>
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Turn Any Chess Board
        <br />
        Into <span className="gradient-text">Digital Moves</span>
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Point your camera at a physical chess board and watch ChessLens automatically detect pieces, track moves, and export professional PGN notation — powered by computer vision.
      </motion.p>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button className="btn-primary-glow" onClick={() => navigate("/record")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/>
          </svg>
          Start Recording
        </button>
        <button className="btn-ghost" onClick={() => navigate("/upload")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Video
        </button>
        <button className="btn-ghost" onClick={() => scrollTo("get-started")}>
          Explore Features ↓
        </button>
      </motion.div>

      <motion.div
        style={{ marginTop: "4rem", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <ChessBoardPreview />
      </motion.div>

      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
