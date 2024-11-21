import { Editor, defaultValueCtx, rootCtx } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";
import { block } from "@milkdown/kit/plugin/block";
import { cursor } from "@milkdown/kit/plugin/cursor";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { collab } from "@milkdown/plugin-collab";
import { useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import {
  ReactPluginViewComponent,
  usePluginViewFactory,
} from "@prosemirror-adapter/react";

type useMilkdownEditorProps = {
  initialMarkdown?: string;
  BlockView: ReactPluginViewComponent;
};

export default function useMilkdownEditor({
  initialMarkdown = "# Note",
  BlockView,
}: useMilkdownEditorProps) {
  const pluginViewFactory = usePluginViewFactory();

  return useEditor((root) => {
    return Editor.make()
      .config((ctx: Ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialMarkdown);
        ctx.set(block.key, {
          view: pluginViewFactory({
            component: BlockView,
          }),
        });
      })
      .config(nord)
      .use(commonmark)
      .use(block)
      .use(cursor)
      .use(collab);
  }, []);
}
