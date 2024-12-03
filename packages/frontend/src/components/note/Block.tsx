import { useEffect, useRef } from "react";

import { BlockProvider } from "@milkdown/kit/plugin/block";
import { useInstance } from "@milkdown/react";

export const BlockView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>();

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return undefined;

    const editor = get();
    if (!editor) return undefined;

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
    });
    tooltipProvider.current?.update();

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading, get]);

  return (
    <div
      ref={ref}
      className="absolute top-[-9999px] w-6 rounded hover:bg-slate-100 cursor-grab flex justify-center items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM16 6.75a.75.75 0 110-1.5.75.75 0 010 1.5z
             M8 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM16 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z
             M8 18.75a.75.75 0 110-1.5.75.75 0 010 1.5zM16 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </svg>
    </div>
  );
};
