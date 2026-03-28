import { useEffect, useState } from "react";
import { userSelect } from "../../slices/userSlice";
import { cchessImportPgn } from "../../utils/cchess";

const Board = ({ pgn }: { pgn: string }) => {
  const [emb, setEmb] = useState<string>("");
  const token = userSelect().token;

  const getEmb = async () => {
    const data = await cchessImportPgn(token, pgn);
    const emb: string = `https://cchess.org/embed/game/${data.id}?theme=brown&bg=dark`;
    setEmb(emb);
  }

  useEffect(() => {
    getEmb();
  }, [])

  return (
    <div className="ratio ratio-21x9">
      <iframe src={emb} />
    </div>
  );
}

export default Board;