import { useEffect, useRef, useState, useCallback } from "react";

export interface AnalysisLine {
  depth: number;
  score: number;
  mate: number | null;
  pv: string;
  moveNumber: number;
}

interface StockfishHook {
  bestMove: string;
  score: number;
  mate: number | null;
  depth: number;
  lines: AnalysisLine[];
  isReady: boolean;
  isAnalyzing: boolean;
  analyze: (fen: string) => void;
}

const useStockfish = (): StockfishHook => {
  const workerRef = useRef<Worker | null>(null);
  const [bestMove, setBestMove] = useState("");
  const [score, setScore] = useState(0);
  const [mate, setMate] = useState<number | null>(null);
  const [depth, setDepth] = useState(0);
  const [lines, setLines] = useState<AnalysisLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const worker = new Worker("/stockfish.js");
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as string;

      if (msg === "uciok") worker.postMessage("isready");
      if (msg === "readyok") setIsReady(true);

      if (msg.startsWith("info depth")) {
        const parsed = parseInfoLine(msg);
        if (parsed) {
          if (parsed.moveNumber === 1) {
            setDepth(parsed.depth);
            setScore(parsed.score);
            setMate(parsed.mate);
          }
          setLines(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(l => l.moveNumber === parsed.moveNumber);
            if (idx >= 0) updated[idx] = parsed; else updated.push(parsed);
            return updated
              .sort((a, b) => {
                if (a.mate !== null && b.mate !== null) return a.mate - b.mate;
                if (a.mate !== null) return -1;
                if (b.mate !== null) return 1;
                return b.score - a.score;
              })
              .slice(0, 3);
          });
        }
      }

      if (msg.startsWith("bestmove")) {
        setBestMove(msg.split(" ")[1] || "");
        setIsAnalyzing(false);
      }
    };

    worker.postMessage("uci");
    worker.postMessage("setoption name MultiPV value 3");

    return () => {
      worker.postMessage("quit");
      worker.terminate();
    };
  }, []);

  const analyze = useCallback((fen: string) => {
    if (!workerRef.current || !isReady) return;
    const worker = workerRef.current;
    worker.postMessage("stop");
    worker.postMessage("ucinewgame");
    worker.postMessage(`position fen ${fen}`);
    setLines([]);
    setBestMove("");
    setIsAnalyzing(true);
    worker.postMessage("go depth 20");
  }, [isReady]);

  return { bestMove, score, mate, depth, lines, isReady, isAnalyzing, analyze };
};

function parseInfoLine(line: string): AnalysisLine | null {
  const depthMatch = line.match(/depth (\d+)/);
  const scoreMatch = line.match(/score cp (-?\d+)/);
  const mateMatch = line.match(/score mate (-?\d+)/);
  const pvMatch = line.match(/ pv (.+)/);
  const multipvMatch = line.match(/multipv (\d+)/);

  if (!depthMatch || !pvMatch) return null;
  if (!scoreMatch && !mateMatch) return null;

  return {
    depth: parseInt(depthMatch[1]),
    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    mate: mateMatch ? parseInt(mateMatch[1]) : null,
    pv: pvMatch[1],
    moveNumber: multipvMatch ? parseInt(multipvMatch[1]) : 1,
  };
}

export default useStockfish;
