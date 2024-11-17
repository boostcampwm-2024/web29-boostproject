import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import { useNodeDrag } from "@/hooks/useNodeDrag.ts";
import { useNodeOperations } from "@/hooks/useNodeOperations.ts";

import Edge from "../Edge.tsx";
import { HeadNode, NoteNode } from "../Node.tsx";
import { Node, initialNodes, nodes } from "../mock.ts";
import PaletteMenu from "./PaletteMenu.tsx";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>(initialNodes);

  const nodeOperations = useNodeOperations({ nodes, setNodes, stageSize });

  const {
    dragState: { mousePosition },
    handlers: { handleDragStart, handleDragEnd, handlePaletteSelect },
  } = useNodeDrag({ nodeOperations });

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
        onDragEnd={handleDragEnd}
        draggable={false}
      >
        <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
          {nodes.map((node) => {
            switch (node.type) {
              case "head":
                return (
                  <HeadNode
                    key={node.id}
                    name={node.name}
                    onDragStart={() => handleDragStart(node.id)}
                  />
                );
              case "note":
                return (
                  <NoteNode
                    key={node.id}
                    x={node.x}
                    y={node.y}
                    name={node.name}
                    onDragStart={() => handleDragStart(node.id)}
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
      {mousePosition && (
        <div
          style={{
            position: "absolute",
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            pointerEvents: "auto",
          }}
        >
          <PaletteMenu
            items={["note", "image", "url", "subspace"]}
            onSelect={handlePaletteSelect}
          />
        </div>
      )}
    </div>
  );
}
