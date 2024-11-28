import React, { useEffect } from "react";
import { Layer, Stage } from "react-konva";

import * as Dialog from "@radix-ui/react-dialog";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import type { Node } from "shared/types";

import { createNote } from "@/api/note";
import { createSpace } from "@/api/space";
import Edge from "@/components/Edge";
import { HeadNode, NoteNode, SubspaceNode } from "@/components/Node";
import useAutofit from "@/hooks/useAutofit";
import useDragNode from "@/hooks/useDragNode";
import useMoveNode from "@/hooks/useMoveNode";
import useSpaceSelection from "@/hooks/useSpaceSelection";
import useYjsSpace from "@/hooks/useYjsSpace";
import { useZoomSpace } from "@/hooks/useZoomSpace";

import PointerLayer from "../PointerLayer";
import GooeyNode from "./GooeyNode";
import { MemoizedNearIndicator } from "./NearNodeIndicator";
import PaletteMenu from "./PaletteMenu";
import SpaceContextMenuWrapper from "./context-menu/SpaceContextMenuWrapper";

interface SpaceViewProps {
  spaceId: string;
  autofitTo?: Element | React.RefObject<Element>;
}

const dragBoundFunc = function (this: Konva.Node) {
  return this.absolutePosition();
};

export default function SpaceView({ spaceId, autofitTo }: SpaceViewProps) {
  const stageRef = React.useRef<Konva.Stage>(null);
  const stageSize = useAutofit(autofitTo); // useAutofit 호출
  const { zoomSpace } = useZoomSpace({ stageRef });

  const {
    nodes,
    edges,
    defineNode,
    defineEdge,
    updateNode,
    deleteNode,
    deleteEdge,
  } = useYjsSpace();

  const nodesArray = nodes ? Object.values(nodes) : [];

  const { move, moveState } = useMoveNode({
    nodes: nodesArray,
    spaceActions: { updateNode },
  });

  const { drag, dropPosition, setDropPosition, handlePaletteSelect } =
    useDragNode(nodesArray, {
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

  const { selectedNode, selectNode, selectedEdge, selectEdge, clearSelection } =
    useSpaceSelection();

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

      stageRef.current?.width(width);
      stageRef.current?.height(height);
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
        onDragStart={() => drag.handlers.onDragStart(node)}
        onDragMove={drag.handlers.onDragMove}
        onDragEnd={() => drag.handlers.onDragEnd()}
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
        id={node.id}
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

  const handleContextMenu = (e: KonvaEventObject<MouseEvent>) => {
    clearSelection();

    const { target } = e;

    if (target.attrs.name === "edge") {
      const edgeId = target.attrs.id;
      if (!edgeId) return;

      selectEdge({ id: edgeId });
      return;
    }

    const group = target.findAncestor("Group");

    const nodeId = group?.attrs?.id as string | undefined;

    if (!nodes || !nodeId) return;

    const nodeMap = nodes as Record<string, Node>;
    const node = nodeMap[nodeId];

    if (
      !node ||
      node.type === "url" ||
      node.type === "image" ||
      node.type === "head"
    )
      return;

    selectNode({ id: nodeId, type: node.type });
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
        id={edgeId}
        key={edgeId || `${edge.from.id}-${edge.to.id}`}
        from={edge.from}
        to={edge.to}
        nodes={nodes}
      />
    ));

  const paletteRenderer = !moveState.isMoving && dropPosition && (
    <Dialog.Root open onOpenChange={(open) => !open && setDropPosition(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="hidden" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed p-0 bg-transparent border-none shadow-none data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 focus:outline-none"
          style={{
            left: `${dropPosition.x + stageSize.width / 2}px`, // stage offset 보정 (Html 포탈을 쓰지 않으므로 보정 필요)
            top: `${dropPosition.y + stageSize.height / 2}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <PaletteMenu
            items={["note", "subspace"]}
            onSelect={handlePaletteSelect}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return (
    <SpaceContextMenuWrapper
      selection={{
        selectedNode,
        selectedEdge,
        clearSelection,
      }}
      actions={{
        onNodeUpdate: updateNode,
        onNodeDelete: deleteNode,
        onEdgeDelete: deleteEdge,
      }}
    >
      {paletteRenderer}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        offsetX={-stageSize.width / 2}
        offsetY={-stageSize.height / 2}
        ref={stageRef}
        onWheel={zoomSpace}
        onContextMenu={handleContextMenu}
        draggable
      >
        <Layer>
          {moveState.isMoving
            ? gooeyNodeMovingRenderer
            : gooeyNodeCreatingRenderer}
          {nearIndicatorRenderer}
          {nodesRenderer}
          {edgesRenderer}
        </Layer>
        <PointerLayer />
      </Stage>
    </SpaceContextMenuWrapper>
  );
}
