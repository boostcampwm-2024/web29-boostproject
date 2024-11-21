import { Milkdown, MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

import useMilkdownCollab from "@/hooks/useMilkdownCollab";
import useMilkdownEditor from "@/hooks/useMilkdownEditor";

import { BlockView } from "./Block";
import "./Editor.css";

function MilkdownEditor() {
  const { loading, get } = useMilkdownEditor({
    BlockView,
  });

  // FIXME - [서버 로직 추가 요망] params에 따라서 다른 접속 경로가 되어야함
  useMilkdownCollab({
    editor: loading ? null : get() || null,
    websocketUrl: "ws://localhost:3001/note",
    roomName: "123",
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
