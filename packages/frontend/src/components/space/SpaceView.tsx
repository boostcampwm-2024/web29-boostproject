import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import Edge from "@/components/Edge";
import { nodes } from "@/components/mock";

import { HeadNode, NoteNode } from "../Node";

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
        {nodes.map((node) => {
          switch (node.type) {
            case "head":
              return <HeadNode key={node.id} name={node.name} />;
            case "note":
              return (
                <NoteNode
                  key={node.id}
                  x={node.x}
                  y={node.y}
                  name={node.name}
                  src=""
                />
              );
            default:
              return null;
          }
        })}
        <Edge from={nodes[0].id} to={nodes[1].id} nodes={nodes} />
        <Edge from={nodes[1].id} to={nodes[2].id} nodes={nodes} />
      </Layer>
    </Stage>
  );
}
