import * as Y from "yjs";

import { createSafeContext } from "@/lib/utils";

interface YjsStoreState {
  yProvider?: Y.AbstractConnector;
  yDoc?: Y.Doc;
}

interface YjsStoreActions {
  setYProvider: (provider: YjsStoreState["yProvider"]) => void;
  setYDoc: (doc: YjsStoreState["yDoc"]) => void;
}

const [useYjsStore, YjsStoreProvider] = createSafeContext<
  YjsStoreState & YjsStoreActions
>();

export { useYjsStore, YjsStoreProvider };
