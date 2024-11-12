import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import { HeadNode, NoteNode } from "../Node.tsx";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!autofitTo) {
      return undefined;
    }

    const containerRef =
      "current" in autofitTo ? autofitTo : { current: autofitTo };

    function resizeStage() {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;

      setStageSize({ width, height });
    }

    resizeStage();

    window.addEventListener("resize", resizeStage);
    return () => {
      window.removeEventListener("resize", resizeStage);
    };
  }, [autofitTo]);

  return (
    <Stage width={stageSize.width} height={stageSize.height} draggable>
      <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
        {/* <SpaceNode label="HEAD NODE" x={0} y={0} /> */}
        <HeadNode name="Hello World" />
        <NoteNode x={100} y={100} src={""} name={"note"} />
      </Layer>
    </Stage>
  );
}
