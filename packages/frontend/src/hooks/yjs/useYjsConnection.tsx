import { useEffect, useState } from "react";

import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function useYjsConnection(docName: string) {
  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [yProvider, setYProvider] = useState<Y.AbstractConnector>();

  useEffect(() => {
    const doc = new Y.Doc();
    // FIXME: backend 서버로 변경
    const provider = new WebsocketProvider(
      "ws://localhost:3001/space",
      docName,
      doc,
    );

    setYDoc(doc);
    setYProvider(provider);

    // provider.on("status", (event: { status: string }) => {
    //   if (event.status === "connected") {
    //     setYProvider(provider);
    //     setYDoc(doc);
    //   }
    // });

    return () => {
      provider.destroy();
      setYDoc(undefined);
      setYProvider(undefined);
    };
  }, [docName]);

  return { yProvider, yDoc, setYProvider, setYDoc };
}
