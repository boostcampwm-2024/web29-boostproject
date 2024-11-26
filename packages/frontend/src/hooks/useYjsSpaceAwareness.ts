import { SpaceAwarenessState } from "shared/types";
import { WebsocketProvider } from "y-websocket";

import useYjsAwarenessStates from "./yjs/useYjsAwareness";

type Awareness = WebsocketProvider["awareness"];

export default function useYjsSpaceAwarenessStates(awareness?: Awareness) {
  return useYjsAwarenessStates<SpaceAwarenessState>(awareness);
}
