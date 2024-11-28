import { useEffect, useState } from "react";

import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { generateUserColor } from "@/lib/utils";

export default function useYjsConnection(docName: string) {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<Error>();
  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [yProvider, setYProvider] = useState<Y.AbstractConnector>();

  useEffect(() => {
    setStatus("connecting");

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws://${import.meta.env.DEV ? "localhost" : "www.honeyflow.life"}/ws/space`,
      docName,
      doc,
    );

    setYDoc(doc);
    setYProvider(provider);

    const { awareness } = provider;

    provider.on(
      "status",
      (event: { status: "connected" | "connecting" | "disconnected" }) => {
        if (event.status === "connected") {
          awareness.setLocalStateField("color", generateUserColor());
        }
        setStatus(event.status);
      },
    );

    provider.once("connection-close", (event: CloseEvent) => {
      if (event.code === 1008) {
        provider.shouldConnect = false;
        setError(new Error("찾을 수 없거나 접근할 수 없는 스페이스예요."));
      }
    });

    return () => {
      if (provider.bcconnected || provider.wsconnected) {
        provider.disconnect();
        provider.destroy();
      }
      setYDoc(undefined);
      setYProvider(undefined);
      setError(undefined);
      setStatus("disconnected");
    };
  }, [docName]);

  return { status, error, yProvider, yDoc, setYProvider, setYDoc };
}
