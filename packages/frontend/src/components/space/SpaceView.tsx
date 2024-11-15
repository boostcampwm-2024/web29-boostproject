import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

import { HeadNode, NoteNode } from "../Node.tsx";
import PaletteMenu, { PaletteButtonType } from "./PaletteMenu.tsx";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [palettePosition, setPalettePosition] = useState<Vector2d | null>(null);
  const [fromNodeId, setFromNodeId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setFromNodeId(id);
  };

  const handleDrop = (e: KonvaEventObject<DragEvent>) => {
    if (!fromNodeId) return;
    const position = e.target.getStage()?.getPointerPosition();

    if (!position) return;
    setPalettePosition(position);
  };

  const handlePaletteSelect = (type: PaletteButtonType) => {
    if (!palettePosition || !fromNodeId || type === "close") {
      setPalettePosition(null);
      return;
    }

    const offSet = stageSize.width / 2;

    const relativeX = palettePosition.x - offSet;
    const relativeY = palettePosition.y - offSet;

    /* FIXME: Websocket 도입 후 반영 */
    // emitNodeCreate({
    //   parent: fromNodeId,
    //   x: relativeX,
    //   y: relativeY,
    // type,
    // });

    console.log({
      parent: fromNodeId,
      x: relativeX,
      y: relativeY,
      type,
    });

    /* TODO: 로컬 상태 업데이트 (임시) */
    // const newNode: NodeType = {
    //   id: "sample",
    //   x: relativeX,
    //   y: relativeY,
    //   type,
    //   name: "sample",
    // };
    // + 렌더링되는 노드배열 상태에 추가

    setPalettePosition(null);
    setFromNodeId(null);
  };

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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onDragEnd={handleDrop}
        draggable={false}
      >
        <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
          <HeadNode
            id={"head-sample"}
            name="Hello World"
            onDragStart={handleDragStart}
          />
          <NoteNode
            id={"note-sample"}
            x={100}
            y={100}
            src={""}
            name={"note"}
            onDragStart={handleDragStart}
          />
        </Layer>
      </Stage>
      {palettePosition && (
        <div
          style={{
            position: "absolute",
            left: palettePosition.x,
            top: palettePosition.y,
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            pointerEvents: "auto",
          }}
        >
          <PaletteMenu
            items={["note", "image", "link"]}
            onSelect={handlePaletteSelect}
          />
        </div>
      )}
    </div>
  );
}
