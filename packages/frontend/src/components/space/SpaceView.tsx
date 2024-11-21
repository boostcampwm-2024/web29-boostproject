import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import type { Node } from "shared/types";

import Edge from "@/components/Edge";
import { HeadNode, NoteNode } from "@/components/Node";
import { edges, nodes } from "@/components/mock";

interface SpaceViewProps {
  autofitTo?: Element | React.RefObject<Element>;
}

export default function SpaceView({ autofitTo }: SpaceViewProps) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = React.useRef<Konva.Stage>(null);

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

  const zoomSpace = (event: KonvaEventObject<WheelEvent, Konva.Node>) => {
    event.evt.preventDefault();

    if (!event.evt.ctrlKey && !event.evt.metaKey) {
      return;
    }

    if (!stageRef.current) {
      return;
    }
    const stage = stageRef.current;

    const oldScale = stage.scaleX();
    const scaleBy = 1.1;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 2.5;

    const { x: pointerX = 0, y: pointerY = 0 } =
      stage.getPointerPosition() ?? {};

    const mousePointTo = {
      x: pointerX / oldScale - stage.x() / oldScale,
      y: pointerY / oldScale - stage.y() / oldScale,
    };

    let newScale =
      event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    if (newScale === oldScale) {
      return;
    }

    stage.scale({ x: newScale, y: newScale });

    const newPosition = {
      x: pointerX - mousePointTo.x * newScale,
      y: pointerY - mousePointTo.y * newScale,
    };

    stage.position(newPosition);
    stage.batchDraw();
  };

  const nodeComponents = {
    head: (node: Node) => <HeadNode key={node.id} name={node.name} />,
    note: (node: Node) => (
      <NoteNode key={node.id} x={node.x} y={node.y} name={node.name} src="" />
    ),
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onWheel={zoomSpace}
      draggable
    >
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
