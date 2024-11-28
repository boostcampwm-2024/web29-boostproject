import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CircleDashedIcon, MoveLeftIcon } from "lucide-react";

import ErrorSection from "@/components/ErrorSection";
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

  if (status === "connecting") {
    return (
      <div className="flex justify-center items-center h-full">
        <CircleDashedIcon className="animate-spin w-32 h-32 text-primary" />
      </div>
    );
  }

  return (
    <YjsStoreProvider value={{ yDoc, yProvider, setYDoc, setYProvider }}>
      <div className="w-full h-full" ref={containerRef}>
        <SpaceView spaceId={spaceId} autofitTo={containerRef} />
        <SpacePageHeader />
      </div>
    </YjsStoreProvider>
  );
}
