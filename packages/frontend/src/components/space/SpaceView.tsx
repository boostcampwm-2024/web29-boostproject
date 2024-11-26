import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import useDragNode from "@/hooks/useDragNode";
import useYjsSpace from "@/hooks/useYjsSpace";
import { useZoomSpace } from "@/hooks/useZoomSpace.ts";

import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import CustomContextMenu from "./CustomContextMenu";
import GooeyNode from "./GooeyNode";
import NearNodeIndicator from "./NearNodeIndicator";
import PaletteMenu from "./PaletteMenu";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

const dragBoundFunc = function (this: Konva.Node) {
  return this.absolutePosition();
};

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = React.useRef<Konva.Stage>(null);
  const { zoomSpace } = useZoomSpace({ stageRef });

  const { nodes, edges, defineNode } = useYjsSpace();

  const nodesArray = nodes ? Object.values(nodes) : [];

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(nodesArray, {
    createNode: (type, parentNode, position, name = "New Note") => {
      defineNode({ type, x: position.x, y: position.y, name }, parentNode.id);
    },
  });
  const { startNode, handlers } = drag;

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
        id={node.id}
        name={node.name}
        onDragStart={() => handlers.onDragStart(node)}
        onDragMove={handlers.onDragMove}
        onDragEnd={handlers.onDragEnd}
        dragBoundFunc={dragBoundFunc}
      />
    ),
    note: (node: Node) => (
      <NoteNode
        key={node.id}
        id={node.id}
        x={node.x}
        y={node.y}
        name={node.name}
        src=""
        onDragStart={() => handlers.onDragStart(node)}
        onDragMove={handlers.onDragMove}
        onDragEnd={handlers.onDragEnd}
        dragBoundFunc={dragBoundFunc}
      />
    ),
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          ref={stageRef}
          onWheel={zoomSpace}
          onContextMenu={(event) => {
            console.log(event.target.id());
          }}
          draggable
        >
          <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
            {drag.isActive && drag.position && startNode && (
              <GooeyNode
                startPosition={{ x: startNode.x, y: startNode.y }}
                dragPosition={drag.position}
              />
            )}
            {drag.position && drag.overlapNode && (
              <NearNodeIndicator overlapNode={drag.overlapNode} />
            )}
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
        <CustomContextMenu />
      </ContextMenuTrigger>
    </ContextMenu>
  );
}
