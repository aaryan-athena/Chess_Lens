import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { GraphModel } from "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import { ModelRefs } from "./types";

const App = () => {
  const [loading, setLoading] = useState(true);

  const piecesModelRef = useRef<GraphModel>();
  const xcornersModelRef = useRef<GraphModel>();
  const modelRefs: ModelRefs = {
    "piecesModelRef": piecesModelRef,
    "xcornersModelRef": xcornersModelRef,
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {!loading && <Outlet context={modelRefs}/>}
    </>
  );
};

export default App;
