import { Layer, Stage } from "react-konva";

import type { Meta, StoryObj } from "@storybook/react";

import SpaceNode from "./SpaceNode.tsx";

export default {
  component: SpaceNode,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      // TODO: Konva를 위한 decorator 별도로 분리 작성 必
      const width = 1000;
      const height = 1000;

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
