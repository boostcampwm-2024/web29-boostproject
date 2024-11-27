import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";

type CustomContextMenuProps = {
  selectedId: string | null;
  selectHandler: (id: string | null) => void;
};

export default function CustomContextMenu({
  selectedId,
  selectHandler,
}: CustomContextMenuProps) {
  return (
    <ContextMenuContent>
      <ContextMenuItem onSelect={() => console.log("현상태:", selectedId)}>
        편집
      </ContextMenuItem>
      <ContextMenuItem>제거</ContextMenuItem>
    </ContextMenuContent>
  );
}
