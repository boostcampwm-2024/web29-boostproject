import { useRef, useState } from "react";

import { CheckIcon, ClipboardCopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

export default function SpaceShareAlertContent() {
  const [hasCopied, setHasCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleClickCopy = () => {
    async function copyToClipboard() {
      await navigator.clipboard.writeText(window.location.href);
      setHasCopied(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }

    copyToClipboard();
  };

  return (
    <div>
      <div>아래 주소를 공유해주세요</div>
      <pre className="p-2 mt-4 rounded-md bg-muted text-muted-foreground select-all text-wrap">
        {window.location.href}
      </pre>
      <div className="mt-4 text-right">
        <Button
          variant={hasCopied ? "ghost" : "default"}
          className={cn("transition")}
          onClick={handleClickCopy}
        >
          {hasCopied ? (
            <>
              <CheckIcon />
              복사 완료
            </>
          ) : (
            <>
              <ClipboardCopyIcon />
              복사하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
