import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const pages = [
  {
    icon: "🎥",
    title: "Upload Video",
    description: "Analyse a pre-recorded game. Upload your video and ChessLens will reconstruct every move automatically.",
    path: "/upload",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  },
  {
    icon: "📷",
    title: "Live Record",
    description: "Point your camera at a live game. ChessLens detects moves in real time as pieces are placed.",
    path: "/record",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
  },
  {
    icon: "♟",
    title: "Replay & Analyse",
    description: "Paste any PGN and replay the game move by move with Stockfish engine suggestions on every position.",
    path: "/replay",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
  },
];

const GetStartedSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  return (
    <section id="get-started" ref={ref}>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Get started</p>
          <h2 className="section-title">Choose your workflow</h2>
          <p className="section-subtitle">
            Three ways to use ChessLens — pick the one that fits your game.
          </p>
        </motion.div>

        <div className="pages-grid">
          {pages.map((page, i) => (
            <motion.div
              key={page.path}
              className="page-card"
              onClick={() => navigate(page.path)}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              style={{ cursor: "pointer" }}
            >
              <div
                className="page-card-bg"
                style={{ background: page.gradient }}
              />
              <div className="page-card-icon">{page.icon}</div>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <div className="page-card-arrow">→</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
