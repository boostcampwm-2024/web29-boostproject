import { useEffect } from "react";

import { Editor } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";
import { CollabService, collabServiceCtx } from "@milkdown/plugin-collab";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

type useMilkdownCollabProps = {
  editor: Editor | null;
  websocketUrl: string;
  roomName: string;
};

export default function useMilkdownCollab({
  editor,
  websocketUrl,
  roomName,
}: useMilkdownCollabProps) {
  useEffect(() => {
    if (!editor) return undefined;

    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(websocketUrl, roomName, doc, {
      connect: true,
    });

    wsProvider.once("synced", async (isSynced: boolean) => {
      if (isSynced) {
        console.log(`성공적으로 연결됨: ${wsProvider.url}`);
      }
    });

    let collabService: CollabService;

    // NOTE - flushSync가 lifecycle 내에서 발생하는 것을 방지하기 위해 settimeout으로 묶어서 micro task로 취급되게 함
    setTimeout(() => {
      editor.action((ctx: Ctx) => {
        collabService = ctx.get(collabServiceCtx);
        collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
      });
    });

    return () => {
      collabService?.disconnect();
      wsProvider?.disconnect();
    };
  }, [editor, websocketUrl, roomName]);
}
