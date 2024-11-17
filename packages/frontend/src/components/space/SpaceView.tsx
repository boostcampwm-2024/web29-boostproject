import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import { edges, nodes } from "@/components/mock";

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

  const nodeComponents = {
    head: (node: Node) => <HeadNode key={node.id} name={node.name} />,
    note: (node: Node) => (
      <NoteNode key={node.id} x={node.x} y={node.y} name={node.name} src="" />
    ),
  };

  return (
    <Stage width={stageSize.width} height={stageSize.height} draggable>
      <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
        {nodes.map((node) => {
          const Component =
            nodeComponents[node.type as keyof typeof nodeComponents];
          return Component ? Component(node) : null;
        })}
        {edges.map((edge) => (
          <Edge
            key={`${edge.from}-${edge.to}`}
            from={edge.from}
            to={edge.to}
            nodes={nodes}
          />
        ))}
      </Layer>
    </Stage>
  );
}
