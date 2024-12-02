import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CircleDashedIcon, MoveLeftIcon } from "lucide-react";

import ErrorSection from "@/components/ErrorSection";
import InteractionGuide from "@/components/space/InteractionGuide";
import SpacePageHeader from "@/components/space/SpacePageHeader";
import SpaceView from "@/components/space/SpaceView";
import { Button } from "@/components/ui/button";
import useYjsConnection from "@/hooks/yjs/useYjsConnection";
import { YjsStoreProvider } from "@/store/yjs";

interface SpacePageParams extends Record<string, string | undefined> {
  spaceId?: string;
}

export default function SpacePage() {
  const navigate = useNavigate();
  const { spaceId } = useParams<SpacePageParams>();

  if (!spaceId) {
    throw new Error("");
  }

  const { error, status, yDoc, yProvider, setYDoc, setYProvider } =
    useYjsConnection(spaceId);
  const containerRef = useRef<HTMLDivElement>(null);

  if (error) {
    return (
      <ErrorSection
        description={error.message}
        RestoreActions={() => (
          <>
            <Button variant="outline" onClick={() => navigate("/")}>
              <MoveLeftIcon />
              처음으로 돌아가기
            </Button>
          </>
        )}
      />
    );
  }

  return (
    <YjsStoreProvider value={{ yDoc, yProvider, setYDoc, setYProvider }}>
      <div className="w-full h-full relative" ref={containerRef}>
        {status === "connecting" ? (
          <div className="flex items-center justify-center w-full h-full">
            <CircleDashedIcon className="animate-spin w-32 h-32 text-primary" />
          </div>
        ) : (
          <SpaceView spaceId={spaceId} autofitTo={containerRef} />
        )}
        <SpacePageHeader spaceId={spaceId} />
        <div
          className="absolute top-7 right-[52px]"
          style={{
            top: "calc(4rem + 24px)",
          }}
        >
          <InteractionGuide />
        </div>
      </div>
    </YjsStoreProvider>
  );
}
