import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import useDragNode from "@/hooks/useDragNode";
import useSpaceSelection from "@/hooks/useSpaceSelection";
import useYjsSpace from "@/hooks/useYjsSpace";
import { useZoomSpace } from "@/hooks/useZoomSpace.ts";

import GooeyNode from "./GooeyNode";
import { MemoizedNearIndicator } from "./NearNodeIndicator";
import PaletteMenu from "./PaletteMenu";
import SpaceContextMenuWrapper from "./context-menu/SpaceContextMenuWrapper";

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

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(nodesArray, {
    createNode: (type, parentNode, position, name = "New Note") => {
      defineNode({ type, x: position.x, y: position.y, name }, parentNode.id);
    },
    createEdge: (fromNode, toNode) => {
      defineEdge(fromNode.id, toNode.id);
    },
  });
  const { startNode, handlers } = drag;
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

  const handleContextMenu = (e: KonvaEventObject<MouseEvent>) => {
    clearSelection();

    const { target } = e;
    console.log(target.attrs);

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

    // FIXME - url, image, head 노드에 대한 편집 임시로 막음
    if (
      !node ||
      node.type === "url" ||
      node.type === "image" ||
      node.type === "head"
    )
      return;

    selectNode({ id: nodeId, type: node.type });
  };

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
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        onWheel={zoomSpace}
        draggable
        onContextMenu={handleContextMenu}
      >
        <Layer offsetX={-stageSize.width / 2} offsetY={-stageSize.height / 2}>
          {drag.isActive && drag.position && startNode && (
            <GooeyNode
              startPosition={{ x: startNode.x, y: startNode.y }}
              dragPosition={drag.position}
            />
          )}
          {drag.position && drag.overlapNode && (
            <MemoizedNearIndicator overlapNode={drag.overlapNode} />
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
                id={edgeId}
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
    </SpaceContextMenuWrapper>
  );
}
