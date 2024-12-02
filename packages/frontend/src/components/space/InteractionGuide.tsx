import { InfoIcon } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const interactions = [
  {
    id: "node-drag",
    title: "새로운 노드 생성",
    description: "노드 드래그",
  },
  {
    id: "node-move",
    title: "노드 이동",
    description: "클릭 + 0.5초 이상 홀드",
  },
  {
    id: "screen-move",
    title: "화면 이동",
    description: "스페이스 빈 공간 클릭 후 드래그",
  },
  {
    id: "screen-zoom",
    title: "화면 줌",
    description: "ctrl + 마우스 휠 또는 트랙패드 제스처",
  },
];

export default function InteractionGuide() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <InfoIcon fill="#FFFFFF" />
      </HoverCardTrigger>
      <HoverCardContent align="end">
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-bold">상호작용 가이드 🐝</h2>
          <ul className="list-disc list-inside">
            {interactions.map((interaction) => (
              <li key={interaction.id}>
                <span className="font-bold">{interaction.title}</span>:&nbsp;
                {interaction.description}
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
