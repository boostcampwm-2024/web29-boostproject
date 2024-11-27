import React from "react";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import type { Node } from "shared/types";

import { createSpace } from "@/api/space";
import Edge from "@/components/Edge";
import { HeadNode, NoteNode, SubspaceNode } from "@/components/Node";
import useAutofit from "@/hooks/useAutofit";
import useDragNode from "@/hooks/useDragNode";
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

  const { nodes, edges, defineNode, defineEdge } = useYjsSpace();

  const nodesArray = nodes ? Object.values(nodes) : [];

  const { drag, dropPosition, handlePaletteSelect } = useDragNode(nodesArray, {
    createNode: (type, parentNode, position, name = "New Note") => {
      if (type === "note") {
        const src = "";
        // FIXME: note 생성 후 id 입력
        defineNode(
          {
            type,
            x: position.x,
            y: position.y,
            name,
            src,
          },
          parentNode.id,
        );

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
  const { startNode, handlers } = drag;

  const stageSize = useAutofit(autofitTo);

  const nodeComponents = {
    head: (node: Node) => (
      <HeadNode
        key={node.id}
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
    subspace: (node: Node) => (
      <SubspaceNode
        key={node.id}
        src={node.src}
        x={node.x}
        y={node.y}
        name={node.name}
        onDragStart={() => handlers.onDragStart(node)}
        onDragMove={handlers.onDragMove}
        onDragEnd={handlers.onDragEnd}
        dragBoundFunc={dragBoundFunc}
      />
    ),
  };

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
      <Layer>
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
      <PointerLayer />
    </Stage>
  );
}
