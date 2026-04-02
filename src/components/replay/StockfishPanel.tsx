import { Chess } from "chess.js";
import { AnalysisLine } from "./useStockfish";

interface StockfishPanelProps {
  score: number;
  mate: number | null;
  depth: number;
  bestMove: string;
  lines: AnalysisLine[];
  isReady: boolean;
  isAnalyzing: boolean;
  currentFen: string;
  lastPlayedMove: string | null;
  prevScore: number | null;
  prevMate: number | null;
  isWhiteTurn: boolean;
}

/** Convert UCI move to SAN using the given FEN */
function uciToSan(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen);
    const move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    return move ? move.san : uci;
  } catch { return uci; }
}

/** Convert a PV (UCI moves) to readable SAN, e.g. "1. e4 e5 2. Nf3" */
function pvToSan(fen: string, pv: string, maxMoves = 5): string {
  const chess = new Chess(fen);
  const result: string[] = [];
  for (const uci of pv.split(" ").slice(0, maxMoves)) {
    try {
      const isWhite = chess.turn() === "w";
      const num = chess.moveNumber();
      const move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      if (!move) break;
      if (isWhite) result.push(`${num}. ${move.san}`);
      else if (result.length === 0) result.push(`${num}... ${move.san}`);
      else result.push(move.san);
    } catch { break; }
  }
  return result.join(" ");
}

/** Position assessment in plain English */
function getPositionAssessment(score: number, mate: number | null, isWhiteTurn: boolean) {
  const ws = isWhiteTurn ? score : -score;
  const wm = mate !== null ? (isWhiteTurn ? mate : -mate) : null;

  if (wm !== null) {
    if (wm > 0) return { text: `White has checkmate in ${wm}`,              color: "#2ecc71" };
    if (wm < 0) return { text: `Black has checkmate in ${Math.abs(wm)}`,    color: "#e74c3c" };
    return             { text: "Checkmate",                                  color: "#e74c3c" };
  }

  const cp = ws / 100;
  if (cp > 5)    return { text: "White is winning",             color: "#2ecc71" };
  if (cp > 2)    return { text: "White has a strong advantage", color: "#27ae60" };
  if (cp > 0.75) return { text: "White is slightly better",     color: "#a3d977" };
  if (cp > -0.75)return { text: "Position is equal",            color: "#bdc3c7" };
  if (cp > -2)   return { text: "Black is slightly better",     color: "#f1948a" };
  if (cp > -5)   return { text: "Black has a strong advantage", color: "#e74c3c" };
  return           { text: "Black is winning",                  color: "#e74c3c" };
}

interface MoveQuality {
  label: string;
  color: string;
  icon: string;
  description: string;
}

/** Classify move quality by comparing eval before/after from white's perspective */
function getMoveQuality(
  prevScore: number | null, prevMate: number | null,
  currScore: number, currMate: number | null,
  isWhiteTurnNow: boolean,
): MoveQuality | null {
  if (prevScore === null && prevMate === null) return null;

  // Normalize to white's perspective
  // At previous position the mover was !isWhiteTurnNow
  const prevWhite = !isWhiteTurnNow ? (prevScore ?? 0) : -(prevScore ?? 0);
  const currWhite =  isWhiteTurnNow ? (currScore ?? 0) : -(currScore ?? 0);

  // Mate handling
  if (prevMate !== null || currMate !== null) {
    if (prevMate === null && currMate !== null) {
      const mateForWhite = isWhiteTurnNow ? currMate : -currMate;
      if ((isWhiteTurnNow && mateForWhite > 0) || (!isWhiteTurnNow && mateForWhite < 0))
        return { label: "Blunder", color: "#e74c3c", icon: "??", description: "Allows forced checkmate" };
    }
    if (currMate !== null && prevMate === null) {
      const mateForMover = !isWhiteTurnNow ? currMate : -currMate;
      if (mateForMover < 0)
        return { label: "Brilliant", color: "#1abc9c", icon: "!!", description: "Finds a forced checkmate" };
    }
    return null;
  }

  const playerIsWhite = !isWhiteTurnNow;
  const evalLoss = playerIsWhite ? (prevWhite - currWhite) : (currWhite - prevWhite);

  if (evalLoss > 300) return { label: "Blunder",    color: "#e74c3c", icon: "??", description: "A serious mistake — loses significant material or position" };
  if (evalLoss > 150) return { label: "Mistake",    color: "#e67e22", icon: "?",  description: "A notable error that worsens the position" };
  if (evalLoss >  60) return { label: "Inaccuracy", color: "#f39c12", icon: "?!", description: "Not the best move — a slightly better option was available" };
  if (evalLoss < -150)return { label: "Brilliant",  color: "#1abc9c", icon: "!!", description: "An exceptional move that dramatically improves the position" };
  if (evalLoss <  -50)return { label: "Great move", color: "#2ecc71", icon: "!",  description: "A strong move that clearly improves the position" };
  return                { label: "Good move",  color: "#95a5a6", icon: "",    description: "A solid, reasonable continuation" };
}

/** Label for each engine line by rank */
function getLineLabel(rank: number): string {
  if (rank === 0) return "Best move";
  if (rank === 1) return "2nd option";
  return "3rd option";
}

/** Brief outcome description for a line */
function getLineOutcome(line: AnalysisLine, isWhiteTurn: boolean): { text: string; color: string } {
  if (line.mate !== null) {
    const m = isWhiteTurn ? line.mate : -line.mate;
    if (m > 0) return { text: `Forces mate for White in ${m}`, color: "#2ecc71" };
    return { text: `Forces mate for Black in ${Math.abs(m)}`, color: "#e74c3c" };
  }
  const ws = (isWhiteTurn ? line.score : -line.score) / 100;
  if (ws > 2)    return { text: "Strongly favors White",  color: "#2ecc71" };
  if (ws > 0.5)  return { text: "Slightly favors White",  color: "#a3d977" };
  if (ws > -0.5) return { text: "Keeps equality",         color: "#bdc3c7" };
  if (ws > -2)   return { text: "Slightly favors Black",  color: "#f1948a" };
  return           { text: "Strongly favors Black",       color: "#e74c3c" };
}

const SURFACE = "rgba(255,255,255,0.04)";
const BORDER  = "rgba(255,255,255,0.08)";
const MUTED   = "rgba(255,255,255,0.4)";
const TEXT    = "#f0f0f0";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.09em", color: MUTED, marginBottom: "0.35rem" }}>
    {children}
  </div>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "0.85rem 1rem", ...style }}>
    {children}
  </div>
);

const StockfishPanel = ({
  score, mate, depth, bestMove, lines, isReady, isAnalyzing,
  currentFen, lastPlayedMove, prevScore, prevMate, isWhiteTurn,
}: StockfishPanelProps) => {
  if (!isReady) {
    return (
      <div style={{ padding: "1.25rem" }}>
        <p style={{ color: MUTED, fontSize: "0.85rem" }}>Loading engine…</p>
      </div>
    );
  }

  const assessment  = getPositionAssessment(score, mate, isWhiteTurn);
  const moveQuality = lastPlayedMove
    ? getMoveQuality(prevScore, prevMate, score, mate, isWhiteTurn)
    : null;
  const bestMoveSan = bestMove ? uciToSan(currentFen, bestMove) : "";

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "1rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
      borderTop: `1px solid ${BORDER}`,
    }}>
      {/* Header */}
      <div style={{ fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "#818cf8", paddingBottom: "0.5rem", borderBottom: `1px solid ${BORDER}` }}>
        Engine Suggestions
      </div>

      {/* Position assessment */}
      <Card>
        <Label>Position</Label>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, color: assessment.color }}>{assessment.text}</span>
          <span style={{ fontSize: "0.72rem", color: MUTED }}>
            {isAnalyzing
              ? <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  d{depth}
                  <span style={{ width: "10px", height: "10px", border: "2px solid rgba(129,140,248,0.5)", borderTopColor: "#818cf8", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                </span>
              : depth > 0 ? `depth ${depth}` : null}
          </span>
        </div>
      </Card>

      {/* Last move quality */}
      {lastPlayedMove && (
        <Card style={{ background: "rgba(255,255,255,0.05)" }}>
          <Label>Last move</Label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: TEXT, fontSize: "1rem" }}>{lastPlayedMove}</span>
            {moveQuality && (
              <>
                {moveQuality.icon && <span style={{ color: moveQuality.color, fontWeight: 700 }}>{moveQuality.icon}</span>}
                <span style={{ color: moveQuality.color, fontWeight: 600, fontSize: "0.88rem" }}>{moveQuality.label}</span>
              </>
            )}
          </div>
          <p style={{ color: MUTED, fontSize: "0.78rem", marginTop: "0.3rem" }}>
            {moveQuality ? moveQuality.description : "Navigate back then forward to compare evals."}
          </p>
        </Card>
      )}

      {/* Engine recommendation */}
      {bestMoveSan && (
        <Card>
          <Label>Engine recommendation</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#a5b4fc", fontSize: "1.15rem" }}>{bestMoveSan}</span>
            <span style={{ color: MUTED, fontSize: "0.78rem" }}>strongest reply</span>
          </div>
        </Card>
      )}

      {/* Tactical alert */}
      {mate !== null && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "10px", padding: "0.85rem 1rem" }}>
          <Label>Tactical alert</Label>
          <div style={{ fontWeight: 700, color: "#f87171" }}>
            {mate > 0
              ? `Checkmate in ${mate} move${mate > 1 ? "s" : ""}`
              : `Facing checkmate in ${Math.abs(mate)} move${Math.abs(mate) > 1 ? "s" : ""}`}
          </div>
          <p style={{ color: MUTED, fontSize: "0.78rem", marginTop: "0.25rem" }}>
            {mate > 0 ? "The side to move has a forced win." : "Urgent defensive resources needed."}
          </p>
        </div>
      )}

      {/* Engine lines */}
      {lines.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.09em", color: MUTED }}>Engine lines</div>
          {lines.map((line, i) => {
            const outcome = getLineOutcome(line, isWhiteTurn);
            const lineSan = pvToSan(currentFen, line.pv);
            return (
              <div key={i} style={{
                background: i === 0 ? "rgba(79,70,229,0.1)" : SURFACE,
                border: `1px solid ${i === 0 ? "rgba(129,140,248,0.2)" : BORDER}`,
                borderRadius: "9px", padding: "0.7rem 0.85rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.78rem", color: i === 0 ? "#a5b4fc" : MUTED }}>
                    {getLineLabel(i)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: outcome.color }}>{outcome.text}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: TEXT, lineHeight: 1.6 }}>
                  {lineSan || "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isAnalyzing && !bestMove && (
        <p style={{ color: MUTED, fontSize: "0.82rem" }}>Navigate to a position to see suggestions.</p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StockfishPanel;
