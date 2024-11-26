import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import logo from "@/assets/logo.svg";
import CustomContextMenu from "@/components/space/CustomContextMenu";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type CreateSpaceButtonProps = {
  navigate: NavigateFunction;
  spaceName: string;
  setSpaceName: Dispatch<SetStateAction<string>>;
};

function CreateSpaceButton({
  navigate,
  spaceName,
  setSpaceName,
}: CreateSpaceButtonProps) {
  const [error, setError] = useState("");
  const handleCreateSpace = (e: FormEvent) => {
    e.preventDefault();
    const targetSpaceName = spaceName.trim();

    if (targetSpaceName === "") {
      setError("이름을 입력해주세요.");
      return;
    }

    navigate(`/space/${targetSpaceName}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>스페이스 생성</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>스페이스 생성</DialogTitle>
          <DialogDescription>
            새로운 스페이스를 생성하기 위한 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateSpace}>
          <Label>
            스페이스 이름
            <Input
              className="mt-1"
              type="text"
              onChange={(e) => {
                setSpaceName(e.target.value);
              }}
            />
          </Label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="secondary">취소</Button>
            </DialogClose>
            <Button type="submit">생성</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function JoinSpaceButton() {
  return (
    <Button disabled aria-disabled="true">
      스페이스 입장
    </Button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [spaceName, setSpaceName] = useState("");

  return (
    <div className="bg-home bg-cover">
      <div className="flex flex-col gap-16 items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Honey Flow"
            className="h-32 mb-4 mr-[33px] drop-shadow-md"
          />
          <span className="text-[16px]">Think Linked, Map Together</span>
        </div>
        <div className="flex flex-col gap-4">
          <CreateSpaceButton
            navigate={navigate}
            spaceName={spaceName}
            setSpaceName={setSpaceName}
          />
          <JoinSpaceButton />
        </div>
      </div>
    </div>
  );
}
