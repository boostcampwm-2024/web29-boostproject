import React from "react";

import { Node } from "shared/types";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import useSpaceSelection from "@/hooks/useSpaceSelection";

import CustomContextMenu from "./CustomContextMenu";
import {
  ContextMenuActions,
  ContextMenuItemConfig,
  SelectionState,
} from "./type";

type SpaceContextMenuWrapperProps = {
  children: React.ReactNode;
  selection: SelectionState;
  action: ContextMenuActions;
};

export default function SpaceContextMenuWrapper({
  children,
  selection,
  action,
}: SpaceContextMenuWrapperProps) {
  const { selectedNode, selectedEdge, clearSelection } = selection;
  const { onNodeUpdate, onNodeDelete, onEdgeDelete } = action;

  const getContextMenuItems = (): ContextMenuItemConfig[] => {
    if (selectedNode) {
      const nodeTypeConfig = {
        note: "노트",
        subspace: "하위스페이스",
        head: "스페이스",
      };

      return [
        {
          label: `${nodeTypeConfig[selectedNode.type]}명 편집`,
          action: () => {
            const nodeNewName = window.prompt("수정할 이름을 입력해주세요.");
            if (!nodeNewName) return;
            onNodeUpdate(selectedNode.id, { name: nodeNewName });
            clearSelection();
          },
        },
        {
          label: "제거",
          action: () => {
            onNodeDelete(selectedNode.id);
            clearSelection();
          },
        },
      ];
    }

    if (selectedEdge) {
      return [
        {
          label: "제거",
          action: () => {
            onEdgeDelete(selectedEdge.id);
            clearSelection();
          },
        },
      ];
    }

    return [];
  };

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          clearSelection();
        }
      }}
    >
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {(selectedNode || selectedEdge) && (
        <CustomContextMenu items={getContextMenuItems()} />
      )}
    </ContextMenu>
  );
}
