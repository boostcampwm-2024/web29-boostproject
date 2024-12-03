import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

import { ContextMenuItemConfig } from "./type";

type CustomContextMenuProps = {
  items: ContextMenuItemConfig[];
};

export default function CustomContextMenu({ items }: CustomContextMenuProps) {
  return (
    <ContextMenuContent>
      {items.map((item) => (
        <ContextMenuItem onSelect={item.action}>{item.label}</ContextMenuItem>
      ))}
    </ContextMenuContent>
  );
}
