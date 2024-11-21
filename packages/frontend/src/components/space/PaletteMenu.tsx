import { Folder, Image, Link, LucideIcon, NotebookPen, X } from "lucide-react";
import { Node } from "shared/types";

import { useEffect, useState } from "react";

import { circle, hexagon } from "@/assets/shapes";

export type PaletteButtonType = Exclude<Node["type"], "head"> | "close";
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
  subspace: { icon: Folder, color: "fill-yellow-400" },
};

const CONTAINER_SIZE = 160;
const BUTTON_SIZE = 60;
const RADIUS = 55;
const MAX_ITEMS = 6;
const CENTER_OFFSET = (CONTAINER_SIZE - BUTTON_SIZE) / 2;

function PaletteButton({ variant, position, onClick }: PaletteButtonProps) {
  const { icon: Icon, color } = buttonConfig[variant];
  const [transform, setTransform] = useState("translate(0, 0)");

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      animationFrameId = requestAnimationFrame(() => {
        setTransform(
          `translate(${position.left - CENTER_OFFSET}px, ${position.top - CENTER_OFFSET}px)`,
        );
      });
    };

    updatePosition();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position.left, position.top]);

  return (
    <div
      className="absolute transition-transform duration-300 ease-in-out"
      style={{
        top: CENTER_OFFSET,
        left: CENTER_OFFSET,
        transform,
        zIndex: variant === "close" ? 10 : "auto",
      }}
      onClick={onClick}
    >
      <button
        className="relative hover:scale-110 transition-transform"
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
        }}
      >
        <svg viewBox="0 0 100 100">
          <path d={circle} className={color}>
            <animate
              attributeName="d"
              from={circle}
              to={hexagon}
              dur="0.6s"
              fill="freeze"
            />
          </path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
}

type PaletteMenuProps = {
  /** 팔레트 메뉴에 표시 옵션 (최대 6개) */
  items: PaletteButtonType[];
  onSelect: (type: PaletteButtonType, name: string | undefined) => void;
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
  const handleButtonClick = (type: PaletteButtonType) => {
    if (type === "note" || type === "subspace") {
      const message = {
        note: "노트 제목을 입력해주세요.",
        subspace: "스페이스 이름을 입력해주세요.",
      };
      const name = window.prompt(message[type]);
      if (name) onSelect(type, name);

      return;
    }

    onSelect(type);
  };

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
        onClick={() => handleButtonClick("close")}
      />
      {items.slice(0, MAX_ITEMS).map((variant, index) => (
        <PaletteButton
          key={`${variant}-${index}`}
          variant={variant}
          position={getPositionByIndex(index)}
          onClick={() => handleButtonClick(variant)}
        />
      ))}
    </div>
  );
}
