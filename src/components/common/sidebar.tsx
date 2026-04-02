import { Chessboard } from "kokopu-react";
import { HomeButton, PgnButton } from "./index.tsx";
import { Game } from "../../types.tsx";
import { gameSelect } from "../../slices/gameSlice.tsx";

const Sidebar = (props: any) => {
  const game: Game = gameSelect();

  const boardDisplay = () => (
    <div style={{ padding: "0.5rem 0" }}>
      <Chessboard
        turnVisible={false}
        squareSize={20}
        position={game.fen}
        coordinateVisible={false}
      />
    </div>
  );

  const textDisplay = () => (
    <div style={{ padding: "0.25rem 0" }}>
      {props.text.map((t: string, i: number) => (
        <div key={i} style={{
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.6)",
          padding: "0.1rem 0",
          fontFamily: "monospace",
        }}>
          {t}
        </div>
      ))}
    </div>
  );

  const buttons = () => (
    <div style={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <PgnButton setText={props.setText} playing={props.playing} />
      <HomeButton />
    </div>
  );

  return (
    <div
      ref={props.sidebarRef}
      style={{
        width: "200px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      {/* Board preview */}
      {props.playing && (
        <div style={{
          padding: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "center",
        }}>
          {boardDisplay()}
        </div>
      )}

      {/* Controls injected by child sidebars */}
      <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {props.children}
        </ul>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "0 0.75rem" }} />

      {/* Move log */}
      {props.text.length > 0 && (
        <div style={{
          padding: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          maxHeight: "120px",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>
            Move log
          </div>
          {textDisplay()}
        </div>
      )}

      {/* Bottom buttons */}
      <div style={{ padding: "0.75rem" }}>
        {buttons()}
      </div>
    </div>
  );
};

export default Sidebar;
