import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import useDragNode from "@/hooks/useDragNode";
import useMoveNode from "@/hooks/useMoveNode";
import useYjsSpace from "@/hooks/useYjsSpace";
import { useZoomSpace } from "@/hooks/useZoomSpace.ts";

import GooeyNode from "./GooeyNode";
import { MemoizedNearIndicator } from "./NearNodeIndicator";
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

  const { nodes, edges, defineNode, defineEdge, updateNode } = useYjsSpace();

  const nodesArray = nodes ? Object.values(nodes) : [];

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(nodesArray, {
    createNode: (type, parentNode, position, name = "New Note") => {
      defineNode({ type, x: position.x, y: position.y, name }, parentNode.id);
    },
    createEdge: (fromNode, toNode) => {
      defineEdge(fromNode.id, toNode.id);
    },
  });

  const { move, moveState } = useMoveNode({ spaceActions: { updateNode } });

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
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={drag.handlers.onDragMove}
        onDragEnd={drag.handlers.onDragEnd}
        dragBoundFunc={dragBoundFunc}
      />
    ),
    note: (node: Node) => (
      <NoteNode
        key={node.id}
        x={node.x}
        y={node.y}
        name={node.name}
        src=""
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={(e) => {
          drag.handlers.onDragMove(e);
          move.callbacks.monitorHoldingPosition(e);
        }}
        onDragEnd={(e) => {
          drag.handlers.onDragEnd();
          move.callbacks.endMove(e);
        }}
        dragBoundFunc={dragBoundFunc}
        onMouseDown={() => move.callbacks.startHold(node)}
        onMouseUp={move.callbacks.endHold}
        onTouchStart={() => move.callbacks.startHold(node)}
        onTouchEnd={move.callbacks.endHold}
      />
    ),
  };

  const GooeyNodeRenderer = drag.isActive &&
    drag.position &&
    drag.startNode && (
      <GooeyNode
        startPosition={{ x: drag.startNode.x, y: drag.startNode.y }}
        dragPosition={drag.position}
        connectionVisible={!moveState.isMoving}
      />
    );

  const NearIndicatorRenderer = !moveState.isMoving &&
    drag.position &&
    drag.overlapNode && (
      <MemoizedNearIndicator overlapNode={drag.overlapNode} />
    );

  const NodesRenderer =
    nodes &&
    Object.entries(nodes).map(([, node]) => {
      const Component =
        nodeComponents[node.type as keyof typeof nodeComponents];
      return Component ? Component(node) : null;
    });

  const EdgesRenderer =
    edges &&
    Object.entries(edges).map(([edgeId, edge]) => (
      <Edge
        key={edgeId || `${edge.from.id}-${edge.to.id}`}
        from={edge.from}
        to={edge.to}
        nodes={nodes}
      />
    ));

  const PaletteRenderer = !moveState.isMoving && dropPosition && (
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
  );

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onWheel={zoomSpace}
      draggable
    >
      <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
        {GooeyNodeRenderer}
        {NearIndicatorRenderer}
        {NodesRenderer}
        {EdgesRenderer}
        {PaletteRenderer}
      </Layer>
    </Stage>
  );
}
