import { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";

import type { Meta, StoryObj } from "@storybook/react";

import SpaceNode from "./SpaceNode.tsx";

export default {
  component: SpaceNode,
  tags: ["autodocs"],
  decorators: [
    (Story, { canvasElement }) => {
      // TODO: Konva Node를 위한 decorator 별도로 분리 必
      const [size, setSize] = useState(() => ({
        width: Math.max(canvasElement.clientWidth, 256),
        height: Math.max(canvasElement.clientHeight, 256),
      }));

      const { width, height } = size;

      useEffect(() => {
        const observer = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
          });
        });

        observer.observe(canvasElement);
        return () => observer.unobserve(canvasElement);
      }, [canvasElement]);

      return (
        <Stage width={width} height={height} draggable>
          <Layer offsetX={-width / 2} offsetY={-height / 2}>
            <Story />
          </Layer>
        </Stage>
      );
    },
  ],
} satisfies Meta<typeof SpaceNode>;

export const Normal: StoryObj = {
  args: {
    label: "HelloWorld",
    x: 0,
    y: 0,
  },
};
