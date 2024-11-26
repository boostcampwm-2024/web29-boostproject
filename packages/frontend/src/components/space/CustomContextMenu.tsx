// interface ContextMenuProps {
//     children?: React.ReactNode;
//     onOpenChange?(open: boolean): void;
//     dir?: Direction;
//     modal?: boolean;
// }
import { useState } from "react";

import { ContextMenuTrigger } from "@radix-ui/react-context-menu";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";

export default function CustomContextMenu() {
  return (
    <ContextMenuContent>
      <ContextMenuItem>편집</ContextMenuItem>
      <ContextMenuItem>제거</ContextMenuItem>
    </ContextMenuContent>
  );
}
