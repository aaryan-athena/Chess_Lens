import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Set up your camera",
    description: "Position your device above or at an angle to your chess board so all 64 squares are clearly visible.",
  },
  {
    number: "2",
    title: "Mark the board corners",
    description: "Tap the four corners of the board once to calibrate the perspective transformation.",
  },
  {
    number: "3",
    title: "Play your game",
    description: "ChessLens continuously scans the board and detects each move as pieces are placed.",
  },
  {
    number: "4",
    title: "Export & analyse",
    description: "Export your game as PGN, replay it with Stockfish analysis, or push it to your chess platform.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div id="how-it-works" className="how-section" ref={ref}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">How it works</p>
          <h2 className="section-title">From board to PGN in four steps</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            No special hardware required — just your phone or laptop camera.
          </p>
        </motion.div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
