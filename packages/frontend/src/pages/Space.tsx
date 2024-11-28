import { useRef } from "react";
import { useParams } from "react-router-dom";

import SpacePageHeader from "@/components/space/SpacePageHeader";
import SpaceView from "@/components/space/SpaceView";
import useYjsConnection from "@/hooks/yjs/useYjsConnection";
import { YjsStoreProvider } from "@/store/yjs";

interface SpacePageParams extends Record<string, string | undefined> {
  spaceId?: string;
}

export default function SpacePage() {
  const { spaceId } = useParams<SpacePageParams>();

  if (!spaceId) {
    throw new Error("");
  }

  const { yDoc, yProvider, setYDoc, setYProvider } = useYjsConnection(spaceId);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <YjsStoreProvider value={{ yDoc, yProvider, setYDoc, setYProvider }}>
      <div className="w-full h-full" ref={containerRef}>
        <SpaceView spaceId={spaceId} autofitTo={containerRef} />
        <SpacePageHeader />
      </div>
    </YjsStoreProvider>
  );
}
