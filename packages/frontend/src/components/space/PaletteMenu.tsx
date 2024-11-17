import { Folder, Image, Link, LucideIcon, NotebookPen, X } from "lucide-react";

import { Node } from "../mock";

export type CreatableNodeType = Exclude<Node["type"], "head">;
export type PaletteButtonType = CreatableNodeType | "close";
type Position = { top: number; left: number };

type PaletteButtonProps = {
  variant: PaletteButtonType;
  position: Position;
  onClick: () => void;
};

const buttonConfig: Record<
  PaletteButtonType,
  { icon: LucideIcon; color: string }
> = {
  note: { icon: NotebookPen, color: "fill-yellow-300" },
  image: { icon: Image, color: "fill-yellow-400" },
  url: { icon: Link, color: "fill-yellow-500" },
  close: { icon: X, color: "fill-yellow-200" },
  subspace: { icon: Folder, color: "fill-yellow-200" },
};

const CONTAINER_SIZE = 160;
const BUTTON_SIZE = 60;
const RADIUS = 55;
const MAX_ITEMS = 6;

function PaletteButton({ variant, position, onClick }: PaletteButtonProps) {
  const { icon: Icon, color } = buttonConfig[variant];

  return (
    <button
      className="absolute transition-transform hover:scale-110"
      style={{
        top: position.top,
        left: position.left,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
      }}
      onClick={onClick}
    >
      <svg viewBox="0 0 100 100">
        <polygon
          points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </button>
  );
}

type PaletteMenuProps = {
  /** 팔레트 메뉴에 표시 옵션 (최대 6개) */
  items: PaletteButtonType[];
  onSelect: (type: PaletteButtonType) => void;
};

function getPositionByIndex(index: number): Position {
  const centerPoint = CONTAINER_SIZE / 2;
  const angle = index * (360 / MAX_ITEMS) * (Math.PI / 180);
  const offset = centerPoint - BUTTON_SIZE / 2;

  return {
    top: offset + RADIUS * Math.sin(angle),
    left: offset + RADIUS * Math.cos(angle),
  };
}

export default function PaletteMenu({ items, onSelect }: PaletteMenuProps) {
  if (import.meta.env.MODE === "development" && items.length > MAX_ITEMS) {
    throw new Error(
      `팔레트 메뉴는 ${MAX_ITEMS}개의 옵션만 표시할 수 있습니다.`,
    );
  }

  const centerOffset = CONTAINER_SIZE / 2 - BUTTON_SIZE / 2;

  return (
    <div
      className="relative"
      style={{
        width: CONTAINER_SIZE,
        height: CONTAINER_SIZE,
      }}
    >
      <PaletteButton
        variant="close"
        position={{
          top: centerOffset,
          left: centerOffset,
        }}
        onClick={() => onSelect("close")}
      />
      {items.slice(0, MAX_ITEMS).map((variant, index) => (
        <PaletteButton
          key={`${variant}-${index}`}
          variant={variant}
          position={getPositionByIndex(index)}
          onClick={() => onSelect(variant)}
        />
      ))}
    </div>
  );
}
