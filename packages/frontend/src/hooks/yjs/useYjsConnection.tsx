import { useEffect, useState } from "react";

import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function useYjsConnection(docName: string) {
  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [yProvider, setYProvider] = useState<Y.AbstractConnector>();

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws://${import.meta.env.DEV ? "localhost" : "www.honeyflow.life"}/ws/space`,
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
      // provider.destroy();
      setYDoc(undefined);
      setYProvider(undefined);
    };
  }, [docName]);

  return { yProvider, yDoc, setYProvider, setYDoc };
}
