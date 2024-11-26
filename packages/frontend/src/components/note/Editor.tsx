import { useParams } from "react-router-dom";

import { Milkdown, MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

import useMilkdownCollab from "@/hooks/useMilkdownCollab";
import useMilkdownEditor from "@/hooks/useMilkdownEditor";

import { BlockView } from "./Block";
import "./Editor.css";

function MilkdownEditor() {
  const { noteId } = useParams<Record<"noteId", string>>();

  const { loading, get } = useMilkdownEditor({
    BlockView,
  });

  useMilkdownCollab({
    editor: loading ? null : get() || null,
    websocketUrl: `ws://${import.meta.env.DEV ? "localhost" : "www.honeyflow.life"}/ws/note`,
    roomName: noteId || "",
  });
  return <Milkdown />;
}

function MilkdownEditorWrapper() {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
}

export default MilkdownEditorWrapper;
