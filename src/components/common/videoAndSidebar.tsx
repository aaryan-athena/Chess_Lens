import { useRef, useState, useEffect } from "react";
import Video from "../common/video";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { cornersReset, cornersSelect } from '../../slices/cornersSlice';
import LoadModels from "../../utils/loadModels";
import { CornersDict, Mode, ModelRefs, Study } from "../../types";
import RecordSidebar from "../record/recordSidebar";
import UploadSidebar from "../upload/uploadSidebar";
import { gameResetFen, gameResetMoves, gameResetStart } from "../../slices/gameSlice";
import { useMediaQuery } from 'react-responsive';
import AppNavbar from "./AppNavbar";

const PortraitWarning = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    flex: 1, padding: "2rem",
  }}>
    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", textAlign: "center" }}>
      Please rotate your device to landscape mode.
    </p>
  </div>
);

const pageMeta: Record<Mode, { title: string; subtitle: string }> = {
  record: { title: "Live Record", subtitle: "Point your camera at the board" },
  upload: { title: "Upload Video", subtitle: "Analyse a recorded game" },
};

const VideoAndSidebar = ({ mode }: { mode: Mode }) => {
  const context = useOutletContext<ModelRefs>();
  const dispatch = useDispatch();
  const corners: CornersDict = cornersSelect();
  const isPortrait = useMediaQuery({ orientation: 'portrait' });

  const [text, setText] = useState<string[]>([]);
  const [playing, setPlaying] = useState<boolean>(false);
  const [study, setStudy] = useState<Study | null>(null);

  const videoRef    = useRef<any>(null);
  const playingRef  = useRef<boolean>(playing);
  const canvasRef   = useRef<any>(null);
  const sidebarRef  = useRef<any>(null);
  const cornersRef  = useRef<CornersDict>(corners);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { cornersRef.current = corners; }, [corners]);

  useEffect(() => {
    LoadModels(context.piecesModelRef, context.xcornersModelRef);
    dispatch(cornersReset());
    dispatch(gameResetStart());
    dispatch(gameResetMoves());
    dispatch(gameResetFen());
  }, []);

  const props = {
    playing, text, study,
    setPlaying, setText, setStudy,
    piecesModelRef: context.piecesModelRef,
    xcornersModelRef: context.xcornersModelRef,
    videoRef, canvasRef, sidebarRef, cornersRef, playingRef,
    mode,
  };

  const Sidebar = () => {
    switch (mode) {
      case "record": return <RecordSidebar {...props} />;
      case "upload": return <UploadSidebar {...props} />;
    }
  };

  const meta = pageMeta[mode];

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      width: "100%", height: "100%",
      background: "#0a0a0f",
    }}>
      <AppNavbar title={meta.title} subtitle={meta.subtitle} />

      <div style={{
        flex: 1, display: "flex", overflow: "hidden",
        minHeight: 0,
      }}>
        {isPortrait ? (
          <PortraitWarning />
        ) : (
          <>
            {Sidebar()}
            <Video {...props} />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoAndSidebar;
