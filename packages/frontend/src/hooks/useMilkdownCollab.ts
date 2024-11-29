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

const template = `# 제목을 입력해 주세요
> 여러 명과 동시에 마크다운 에디터를 활용할 수 있습니다.`;

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

    let collabService: CollabService;

    wsProvider.once("synced", async (isSynced: boolean) => {
      if (isSynced) {
        collabService.applyTemplate(template);
        console.log(`성공적으로 연결됨: ${wsProvider.url}`);
      }
    });

    // NOTE - flushSync가 lifecycle 내에서 발생하는 것을 방지하기 위해 setTimeout으로 묶어서 micro task로 취급되게 함
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
