import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import { edgeSample, nodeSample } from "@/components/mock";
import useDragNode from "@/hooks/useDragNode";
import useSpaceElements from "@/hooks/useSpaceElements";

import GooeyNode from "./GooeyNode";
import PaletteMenu from "./PaletteMenu";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const { nodes, edges, spaceActions } = useSpaceElements({
    initialNodes: nodeSample,
    initialEdges: edgeSample,
  });

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(
    nodes,
    spaceActions,
  );
  const { startNode, handlers } = drag;

  function createDragBoundFunc(node: Node) {
    return function dragBoundFunc() {
      /** 원래 위치로 고정. stage도 draggable하므로 Layer에 적용된 offset을 보정하여 절대 위치로 표시.  */
      return {
        x: node.x + stageSize.width / 2,
        y: node.y + stageSize.height / 2,
      };
    };
  }
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
    head: (node: Node) => (
      <HeadNode
        key={node.id}
        name={node.name}
        onDragStart={() => handlers.onDragStart(node)}
        onDragMove={handlers.onDragMove}
        onDragEnd={handlers.onDragEnd}
        dragBoundFunc={createDragBoundFunc(node)}
      />
    ),
    note: (node: Node) => (
      <NoteNode
        key={node.id}
        x={node.x}
        y={node.y}
        name={node.name}
        src=""
        onDragStart={() => handlers.onDragStart(node)}
        onDragMove={handlers.onDragMove}
        onDragEnd={handlers.onDragEnd}
        dragBoundFunc={createDragBoundFunc(node)}
      />
    ),
  };

  return (
    <Stage width={stageSize.width} height={stageSize.height} draggable>
      <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
        {drag.isActive && drag.position && startNode && (
          <GooeyNode
            startPosition={{ x: startNode.x, y: startNode.y }}
            dragPosition={drag.position}
          />
        )}
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
                items={["note", "image", "url"]}
                onSelect={handlePaletteSelect}
              />
            </div>
          </Html>
        )}
      </Layer>
    </Stage>
  );
}
