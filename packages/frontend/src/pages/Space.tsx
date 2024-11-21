import { useRef } from "react";
import { useParams } from "react-router-dom";

import YjsSpaceView from "@/components/space/YjsSpaceView";

interface SpacePageParams extends Record<string, string | undefined> {
  entrySpaceId?: string;
}

export default function SpacePage() {
  const { entrySpaceId } = useParams<SpacePageParams>();

  if (!entrySpaceId) {
    throw new Error("");
  }

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="text-sm"
      style={{ width: "100%", height: "100%" }}
      ref={containerRef}
    >
      <YjsSpaceView spaceId="123" autofitTo={containerRef} />
    </div>
  );
}
