import React from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import type { Node } from "shared/types";

import { createNote } from "@/api/note";
import { createSpace } from "@/api/space";
import Edge from "@/components/Edge";
import { HeadNode, NoteNode, SubspaceNode } from "@/components/Node";
import useAutofit from "@/hooks/useAutofit";
import useDragNode from "@/hooks/useDragNode";
import useMoveNode from "@/hooks/useMoveNode";
import useYjsSpace from "@/hooks/useYjsSpace";
import { useZoomSpace } from "@/hooks/useZoomSpace.ts";

import PointerLayer from "../PointerLayer";
import GooeyNode from "./GooeyNode";
import { MemoizedNearIndicator } from "./NearNodeIndicator";
import PaletteMenu from "./PaletteMenu";

interface SpaceViewProps {
  spaceId: string;
  autofitTo?: Element | React.RefObject<Element>;
}

const dragBoundFunc = function (this: Konva.Node) {
  return this.absolutePosition();
};

export default function SpaceView({ spaceId, autofitTo }: SpaceViewProps) {
  const stageRef = React.useRef<Konva.Stage>(null);
  const { zoomSpace } = useZoomSpace({ stageRef });

  const { nodes, edges, defineNode, defineEdge, updateNode } = useYjsSpace();

  const nodesArray = nodes ? Object.values(nodes) : [];

  const { move, moveState } = useMoveNode({
    nodes: nodesArray,
    spaceActions: { updateNode },
  });

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(nodesArray, {
    createNode: (type, parentNode, position, name = "New Note") => {
      if (type === "note") {
        createNote({
          userId: "honeyflow",
          noteName: name,
        }).then((res) => {
          defineNode(
            {
              type,
              x: position.x,
              y: position.y,
              name,
              src: res.urlPath.toString(),
            },
            parentNode.id,
          );
        });

        return;
      }

      if (type === "subspace") {
        createSpace({
          spaceName: name,
          userId: "honeyflow",
          parentContextNodeId: spaceId,
        }).then((res) => {
          const [urlPath] = res.urlPath;
          defineNode(
            {
              type,
              x: position.x,
              y: position.y,
              name,
              src: urlPath,
            },
            parentNode.id,
          );
        });

        return;
      }

      defineNode(
        {
          type,
          x: position.x,
          y: position.y,
          name,
          src: "",
        },
        parentNode.id,
      );
    },
    createEdge: (fromNode, toNode) => {
      defineEdge(fromNode.id, toNode.id);
    },
  });

  const stageSize = useAutofit(autofitTo);

  const nodeComponents = {
    head: (node: Node) => (
      <HeadNode
        key={node.id}
        name={node.name}
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={drag.handlers.onDragMove}
        onDragEnd={() => drag.handlers.onDragEnd()}
        dragBoundFunc={dragBoundFunc}
      />
    ),
    note: (node: Node) => (
      <NoteNode
        key={node.id}
        x={node.x}
        y={node.y}
        name={node.name}
        src={node.src || ""}
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={(e) => {
          drag.handlers.onDragMove(e);
          move.callbacks.monitorHoldingPosition(e);
        }}
        onDragEnd={(e) => {
          drag.handlers.onDragEnd(moveState.isMoving);
          move.callbacks.endMove(e);
        }}
        dragBoundFunc={dragBoundFunc}
        onMouseDown={(e) => move.callbacks.startHold(node, e)}
        onMouseUp={move.callbacks.endHold}
        onTouchStart={(e) => move.callbacks.startHold(node, e)}
        onTouchEnd={move.callbacks.endHold}
      />
    ),
    subspace: (node: Node) => (
      <SubspaceNode
        key={node.id}
        x={node.x}
        y={node.y}
        name={node.name}
        src={node.src || ""}
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={(e) => {
          drag.handlers.onDragMove(e);
          move.callbacks.monitorHoldingPosition(e);
        }}
        onDragEnd={(e) => {
          drag.handlers.onDragEnd(moveState.isMoving);
          move.callbacks.endMove(e);
        }}
        dragBoundFunc={dragBoundFunc}
        onMouseDown={(e) => move.callbacks.startHold(node, e)}
        onMouseUp={move.callbacks.endHold}
        onTouchStart={(e) => move.callbacks.startHold(node, e)}
        onTouchEnd={move.callbacks.endHold}
      />
    ),
  };

  const gooeyNodeCreatingRenderer = drag.isActive &&
    drag.position &&
    drag.startNode && (
      <GooeyNode
        startPosition={{ x: drag.startNode.x, y: drag.startNode.y }}
        dragPosition={drag.position}
      />
    );

  const gooeyNodeMovingRenderer = drag.position && (
    <GooeyNode
      startPosition={{ x: 0, y: 0 }}
      dragPosition={drag.position}
      connectionVisible={false}
      color={moveState.isOverlapping ? "#ECE8E4" : "#FFF2CB"}
    />
  );

  const nearIndicatorRenderer = !moveState.isMoving &&
    drag.position &&
    drag.overlapNode && (
      <MemoizedNearIndicator overlapNode={drag.overlapNode} />
    );

  const nodesRenderer =
    nodes &&
    Object.entries(nodes).map(([, node]) => {
      const Component =
        nodeComponents[node.type as keyof typeof nodeComponents];
      return Component ? Component(node) : null;
    });

  const edgesRenderer =
    edges &&
    Object.entries(edges).map(([edgeId, edge]) => (
      <Edge
        key={edgeId || `${edge.from.id}-${edge.to.id}`}
        from={edge.from}
        to={edge.to}
        nodes={nodes}
      />
    ));

  const paletteRenderer = !moveState.isMoving && dropPosition && (
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
  );

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      offsetX={-stageSize.width / 2}
      offsetY={-stageSize.height / 2}
      ref={stageRef}
      onWheel={zoomSpace}
      draggable
    >
      <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
        {moveState.isMoving
          ? gooeyNodeMovingRenderer
          : gooeyNodeCreatingRenderer}
        {nearIndicatorRenderer}
        {nodesRenderer}
        {edgesRenderer}
        {paletteRenderer}
      </Layer>
      <PointerLayer />
    </Stage>
  );
}
