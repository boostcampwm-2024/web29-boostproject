import { RefObject } from "react";

import useYjsConnection from "@/hooks/yjs/useYjsConnection";
import { YjsStoreProvider } from "@/store/yjs";

import SpaceView from "./SpaceView";

type YjsSpaceViewProps = {
  spaceId: string;
  autofitTo?: Element | RefObject<Element>;
};

export default function YjsSpaceView({
  spaceId,
  autofitTo,
}: YjsSpaceViewProps) {
  const { yDoc, yProvider, setYDoc, setYProvider } = useYjsConnection(spaceId);

  return (
    <YjsStoreProvider value={{ yDoc, yProvider, setYDoc, setYProvider }}>
      <SpaceView spaceId={spaceId} autofitTo={autofitTo} />
    </YjsStoreProvider>
  );
}
