import { useState, useCallback, useEffect, useRef } from "react";
import { Chessboard } from "kokopu-react";
import { Chess } from "chess.js";
import StockfishPanel from "./StockfishPanel";
import useStockfish from "./useStockfish";
import { START_FEN } from "../../utils/constants";
import AppNavbar from "../common/AppNavbar";

/* ── Shared token ─────────────────────────── */
const BG        = "#0a0a0f";
const SURFACE   = "rgba(255,255,255,0.03)";
const BORDER    = "rgba(255,255,255,0.08)";
const ACCENT    = "#4f46e5";
const ACCENT_BG = "rgba(79,70,229,0.18)";
const TEXT      = "#f0f0f0";
const MUTED     = "rgba(255,255,255,0.45)";

/* ── Themed button helpers ────────────────── */
const PrimaryBtn = ({ onClick, children, style }: { onClick?: () => void; children: React.ReactNode; style?: React.CSSProperties }) => (
  <button onClick={onClick} style={{
    padding: "0.55rem 1.4rem", borderRadius: "9px",
    background: `linear-gradient(135deg, ${ACCENT}, #7c3aed)`,
    border: "none", color: "#fff", fontWeight: 600,
    fontSize: "0.9rem", cursor: "pointer",
    boxShadow: "0 0 20px rgba(79,70,229,0.35)",
    transition: "filter 0.2s, transform 0.15s",
    ...style,
  }}
    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
  >
    {children}
  </button>
);

const GhostBtn = ({ onClick, children, style }: { onClick?: () => void; children: React.ReactNode; style?: React.CSSProperties }) => (
  <button onClick={onClick} style={{
    padding: "0.45rem 1rem", borderRadius: "8px",
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: MUTED, fontSize: "0.82rem", cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s, color 0.2s",
    ...style,
  }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}
  >
    {children}
  </button>
);

const NavBtn = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) => (
  <button onClick={onClick} title={title} style={{
    width: "40px", height: "40px", borderRadius: "8px",
    background: SURFACE, border: `1px solid ${BORDER}`,
    color: MUTED, fontSize: "1rem", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s, color 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = ACCENT_BG; e.currentTarget.style.color = "#a5b4fc"; }}
    onMouseLeave={e => { e.currentTarget.style.background = SURFACE; e.currentTarget.style.color = MUTED; }}
  >
    {children}
  </button>
);

/* ── Component ───────────────────────────── */
const ReplayPage = () => {
  const [pgnInput, setPgnInput] = useState<string>("");
  const [game, setGame] = useState<Chess | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMove, setCurrentMove] = useState<number>(-1);
  const [currentFen, setCurrentFen] = useState<string>(START_FEN);
  const [error, setError] = useState<string>("");
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const [prevMate, setPrevMate] = useState<number | null>(null);

  const stockfish = useStockfish();
  const lastSettledScore = useRef<number>(0);
  const lastSettledMate  = useRef<number | null>(null);

  useEffect(() => {
    if (!stockfish.isAnalyzing && stockfish.depth > 0) {
      lastSettledScore.current = stockfish.score;
      lastSettledMate.current  = stockfish.mate;
    }
  }, [stockfish.isAnalyzing, stockfish.depth, stockfish.score, stockfish.mate]);

  const loadPgn = useCallback(() => {
    const trimmed = pgnInput.trim();
    if (!trimmed) { setError("Please enter a PGN"); return; }
    try {
      const chess = new Chess();
      chess.loadPgn(trimmed);
      const history = chess.history();
      if (history.length === 0) { setError("No moves found in PGN"); return; }
      setGame(chess); setMoves(history);
      setCurrentMove(-1); setCurrentFen(START_FEN);
      setPrevScore(null); setPrevMate(null); setError("");
      lastSettledScore.current = 0; lastSettledMate.current = null;
      stockfish.analyze(START_FEN);
    } catch { setError("Invalid PGN format"); }
  }, [pgnInput, stockfish]);

  const goToMove = useCallback((moveIndex: number) => {
    if (!game) return;
    setPrevScore(lastSettledScore.current);
    setPrevMate(lastSettledMate.current);
    const chess = new Chess();
    const history = game.history();
    for (let i = 0; i <= moveIndex && i < history.length; i++) chess.move(history[i]);
    const fen = moveIndex < 0 ? START_FEN : chess.fen();
    setCurrentMove(moveIndex); setCurrentFen(fen);
    stockfish.analyze(fen);
  }, [game, stockfish]);

  const goFirst = () => goToMove(-1);
  const goPrev  = () => goToMove(Math.max(-1, currentMove - 1));
  const goNext  = () => goToMove(Math.min(moves.length - 1, currentMove + 1));
  const goLast  = () => goToMove(moves.length - 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); goPrev();  break;
        case "ArrowRight": e.preventDefault(); goNext();  break;
        case "Home":       e.preventDefault(); goFirst(); break;
        case "End":        e.preventDefault(); goLast();  break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const movePairs: [string, string | null][] = [];
  for (let i = 0; i < moves.length; i += 2)
    movePairs.push([moves[i], i + 1 < moves.length ? moves[i + 1] : null]);

  const isWhiteTurn    = currentFen.includes(" w ");
  const lastPlayedMove = currentMove >= 0 ? moves[currentMove] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: BG, color: TEXT }}>
      <AppNavbar title="Replay & Analyse" subtitle="PGN game replay with engine analysis" />

      {!game ? (
        /* ── PGN input screen ── */
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
        }}>
          <div style={{ width: "100%", maxWidth: "620px" }}>
            {/* Card */}
            <div style={{
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: "20px", padding: "2.5rem",
            }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#818cf8", marginBottom: "0.5rem" }}>
                  Game replay
                </p>
                <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.02em" }}>
                  Paste your PGN
                </h2>
                <p style={{ color: MUTED, fontSize: "0.9rem", marginTop: "0.4rem" }}>
                  Import any PGN game and step through moves with Stockfish analysis on every position.
                </p>
              </div>

              <textarea
                style={{
                  width: "100%", borderRadius: "10px", padding: "0.85rem 1rem",
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
                  color: TEXT, fontSize: "0.85rem", fontFamily: "monospace",
                  resize: "vertical", outline: "none", lineHeight: 1.6,
                  transition: "border-color 0.2s",
                }}
                rows={11}
                placeholder={"1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ..."}
                value={pgnInput}
                onChange={e => setPgnInput(e.target.value)}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
              />

              {error && (
                <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.5rem" }}>{error}</p>
              )}

              <PrimaryBtn onClick={loadPgn} style={{ width: "100%", marginTop: "1rem" }}>
                Load Game →
              </PrimaryBtn>
            </div>
          </div>
        </div>
      ) : (
        /* ── Replay view ── */
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* Left: board + nav */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
            borderRight: `1px solid ${BORDER}`,
            gap: "1rem",
          }}>
            {/* Board wrapper */}
            <div style={{
              borderRadius: "14px", overflow: "hidden",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              <Chessboard
                position={currentFen}
                squareSize={60}
                coordinateVisible={true}
                turnVisible={false}
              />
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <NavBtn onClick={goFirst} title="First move">«</NavBtn>
              <NavBtn onClick={goPrev}  title="Previous">‹</NavBtn>
              <NavBtn onClick={goNext}  title="Next">›</NavBtn>
              <NavBtn onClick={goLast}  title="Last move">»</NavBtn>
            </div>

            {/* Move counter */}
            <div style={{ fontSize: "0.78rem", color: MUTED }}>
              {currentMove < 0 ? "Start position" : `Move ${currentMove + 1} of ${moves.length}`}
            </div>

            <GhostBtn onClick={() => { setGame(null); setMoves([]); setCurrentMove(-1); setPrevScore(null); setPrevMate(null); }}>
              ← Load different PGN
            </GhostBtn>
          </div>

          {/* Middle: move list */}
          <div style={{
            flex: "1 1 260px", minWidth: "180px", maxWidth: "300px",
            display: "flex", flexDirection: "column",
            borderRight: `1px solid ${BORDER}`,
          }}>
            <div style={{
              padding: "0.75rem 1rem",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED }}>
                Moves
              </span>
              <span style={{ fontSize: "0.72rem", color: MUTED }}>
                {moves.length} half-moves
              </span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
              {movePairs.map(([white, black], pairIdx) => {
                const wi = pairIdx * 2;
                const bi = pairIdx * 2 + 1;
                const wActive = currentMove === wi;
                const bActive = currentMove === bi;
                return (
                  <div key={pairIdx} style={{
                    display: "flex", alignItems: "center",
                    borderRadius: "6px", marginBottom: "2px",
                    background: (wActive || bActive) ? ACCENT_BG : "transparent",
                  }}>
                    <span style={{
                      width: "32px", flexShrink: 0, padding: "0.3rem 0.4rem",
                      fontSize: "0.78rem", color: MUTED, textAlign: "right",
                    }}>
                      {pairIdx + 1}.
                    </span>
                    <span onClick={() => goToMove(wi)} style={{
                      flex: 1, padding: "0.3rem 0.4rem",
                      fontSize: "0.88rem", fontFamily: "monospace",
                      color: wActive ? "#a5b4fc" : TEXT,
                      fontWeight: wActive ? 700 : 400,
                      cursor: "pointer", borderRadius: "5px",
                      background: wActive ? "rgba(129,140,248,0.12)" : "transparent",
                    }}>{white}</span>
                    {black && (
                      <span onClick={() => goToMove(bi)} style={{
                        flex: 1, padding: "0.3rem 0.4rem",
                        fontSize: "0.88rem", fontFamily: "monospace",
                        color: bActive ? "#a5b4fc" : TEXT,
                        fontWeight: bActive ? 700 : 400,
                        cursor: "pointer", borderRadius: "5px",
                        background: bActive ? "rgba(129,140,248,0.12)" : "transparent",
                      }}>{black}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Stockfish panel */}
          <div style={{
            flex: "1 1 280px", minWidth: "240px", maxWidth: "400px",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <StockfishPanel
              score={stockfish.score}
              mate={stockfish.mate}
              depth={stockfish.depth}
              bestMove={stockfish.bestMove}
              lines={stockfish.lines}
              isReady={stockfish.isReady}
              isAnalyzing={stockfish.isAnalyzing}
              currentFen={currentFen}
              lastPlayedMove={lastPlayedMove}
              prevScore={prevScore}
              prevMate={prevMate}
              isWhiteTurn={isWhiteTurn}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplayPage;
