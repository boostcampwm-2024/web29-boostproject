import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import { useDragNode } from "@/hooks/useNodeDrag.ts";
import { useNodeOperations } from "@/hooks/useNodeOperations.ts";

import Edge from "../Edge.tsx";
import { HeadNode, NoteNode } from "../Node.tsx";
import { EdgeType, NodeType, initialEdges, initialNodes } from "../mock.ts";
import PaletteMenu from "./PaletteMenu.tsx";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [edges, setEdges] = useState<EdgeType[]>(initialEdges);

  const nodeOperations = useNodeOperations({
    setNodes,
    setEdges,
    stageSize,
  });

  const {
    dragState: { dropPosition },
    handlers: { handleDragStart, handleDragEnd, handlePaletteSelect },
  } = useDragNode({ nodeOperations });

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
          {edges.map((edge) => (
            <Edge
              key={edge.from + edge.to}
              from={edge.from}
              to={edge.to}
              nodes={nodes}
            />
          ))}

          {dropPosition && (
            <Html>
              <div
                style={{
                  position: "absolute",
                  left: dropPosition.x,
                  top: dropPosition.y,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto",
                }}
              >
                <PaletteMenu
                  items={["note", "image", "url", "subspace"]}
                  onSelect={handlePaletteSelect}
                />
              </div>
            </Html>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
