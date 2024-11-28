import {
  FormEventHandler,
  ReactNode,
  isValidElement,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PromptField<N extends string> = {
  label: string;
  name: N;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
};

const subscribers = new Set<() => void>();

let promptContents: {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  fields?: PromptField<string>[];
  onSubmit?: (data: Record<string, string>) => void;
  onCancel?: () => void;
} = {
  open: false,
};

function setPrompt(update: Omit<typeof promptContents, "open">) {
  promptContents = { ...update, open: true };
  subscribers.forEach((fn) => fn());
}
function closePrompt() {
  promptContents = { ...promptContents, open: false };
  subscribers.forEach((fn) => fn());
}

export async function prompt<NS extends string>(
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  ...fields: PromptField<NS>[]
) {
  return new Promise<Record<NS, string>>((resolve, reject) => {
    setPrompt({
      title,
      description,
      fields,
      onSubmit: resolve,
      onCancel: reject,
    });
  });
}

export function PromptDialogPortal() {
  const getSnapshot = () => promptContents;

  const data = useSyncExternalStore((onStoreChange) => {
    subscribers.add(onStoreChange);
    return () => {
      subscribers.delete(onStoreChange);
    };
  }, getSnapshot);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    promptContents.onSubmit?.(data);
    closePrompt();
  };

  return (
    <Dialog
      open={data.open}
      onOpenChange={(open) => {
        if (!open) {
          promptContents.onCancel?.();
          closePrompt();
        }
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          {data?.title && <DialogTitle>{data?.title}</DialogTitle>}
          {data?.description && (
            <DialogDescription asChild={isValidElement(data.description)}>
              {data.description}
            </DialogDescription>
          )}
        </DialogHeader>
        {Boolean(data?.fields?.length) && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {data.fields?.map(
                ({ label, name, placeholder, type, defaultValue }) => (
                  <div
                    key={name}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={name} className="text-right">
                      {label}
                    </Label>
                    <Input
                      name={name}
                      className="col-span-3"
                      placeholder={placeholder}
                      type={type}
                      defaultValue={defaultValue}
                    />
                  </div>
                ),
              )}
            </div>
            <DialogFooter>
              <Button type="submit">확인</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
