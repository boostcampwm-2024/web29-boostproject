import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import useYjsSpace from "@/hooks/useYjsSpace";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const { nodes, edges } = useYjsSpace();

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
        {nodes &&
          Object.entries(nodes).map(([, node]) => {
            const Component =
              nodeComponents[node.type as keyof typeof nodeComponents];
            return Component ? Component(node) : null;
          })}
        {edges &&
          Object.entries(edges).map(([edgeId, edge]) => (
            <Edge
              key={edgeId || `${edge.from.id}-${edge.to.id}`}
              from={edge.from}
              to={edge.to}
              nodes={nodes}
            />
          ))}
      </Layer>
    </Stage>
  );
}
