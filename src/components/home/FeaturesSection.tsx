import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: "📷",
    bg: "rgba(79,70,229,0.15)",
    title: "Live Camera Detection",
    description: "Real-time piece recognition using TensorFlow.js — no server required. Runs entirely in your browser.",
  },
  {
    icon: "🎥",
    bg: "rgba(124,58,237,0.15)",
    title: "Video Upload Analysis",
    description: "Analyze recorded games by uploading a video. ChessLens scrubs through frames to reconstruct every move.",
  },
  {
    icon: "♟️",
    bg: "rgba(192,132,252,0.15)",
    title: "Automatic PGN Export",
    description: "Every detected move is converted to standard PGN notation and can be exported or imported to chess platforms.",
  },
  {
    icon: "🔍",
    bg: "rgba(244,114,182,0.15)",
    title: "Stockfish Engine Analysis",
    description: "Replay any game with Stockfish-powered suggestions, move quality labels, and position assessments.",
  },
  {
    icon: "📡",
    bg: "rgba(52,211,153,0.15)",
    title: "Live Broadcast",
    description: "Stream your over-the-board game to any chess platform in real time using the broadcast integration.",
  },
  {
    icon: "🔒",
    bg: "rgba(251,191,36,0.15)",
    title: "Fully Private",
    description: "All computer vision runs locally in your browser. Your board footage never leaves your device.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features">
      <div className="section" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Features</p>
          <h2 className="section-title">Everything you need to digitise<br />over-the-board chess</h2>
          <p className="section-subtitle">
            From live detection to engine analysis — ChessLens covers the full workflow.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="feature-icon" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
