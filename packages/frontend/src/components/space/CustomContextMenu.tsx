import { selectedInfoType } from "@/hooks/useSpaceSelection";

import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";

type CustomContextMenuProps = {
  selectedInfo: selectedInfoType;
  selectHandler: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export default function CustomContextMenu({
  selectedInfo,
  onEditClick,
  onDeleteClick,
}: CustomContextMenuProps) {
  console.log(selectedInfo);
  const { type } = selectedInfo;

  const nodeTypeConfig = {
    note: "노트",
    subspace: "하위스페이스",
    head: "스페이스",
  };

  return (
    <ContextMenuContent>
      {type && (
        <ContextMenuItem onSelect={onEditClick}>
          {nodeTypeConfig[type]}명 편집
        </ContextMenuItem>
      )}
      <ContextMenuItem onSelect={onDeleteClick}>제거</ContextMenuItem>
    </ContextMenuContent>
  );
}
