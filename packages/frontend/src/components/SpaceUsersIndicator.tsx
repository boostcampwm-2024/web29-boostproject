import { WebsocketProvider } from "y-websocket";

import useYjsSpaceAwarenessStates from "@/hooks/useYjsSpaceAwareness";
import { useYjsStore } from "@/store/yjs";

function SpaceUserAvatar({ color }: { color: string }) {
  return (
    <div className="flex-shrink">
      <div
        className="w-4 h-4 ring ring-background rounded-full"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}

export default function SpaceUsersIndicator() {
  const { yProvider } = useYjsStore();
  const awareness = (yProvider as WebsocketProvider | undefined)?.awareness;
  const { states: userStates } = useYjsSpaceAwarenessStates(awareness);

  return (
    <div className="">
      {userStates.size > 4 && (
        <span className="float-left mr-2 text-xs">+{userStates.size - 4}</span>
      )}
      <div className="flex flex-row -space-x-1">
        {[...userStates].slice(0, 4).map(([userId, { color }]) => (
          <SpaceUserAvatar key={userId} color={color} />
        ))}
      </div>
    </div>
  );
}
