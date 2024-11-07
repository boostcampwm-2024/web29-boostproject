import { useNavigate, NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction, useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

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
      <DialogTrigger>
        <Button>스페이스 생성</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>스페이스 생성</DialogTitle>
          <DialogDescription>
            새로운 스페이스를 생성하기 위한 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4" onSubmit={handleCreateSpace}>
          <label className="block mb-4">
            스페이스 이름
            <input
              type="text"
              className="mt-1 block w-full border rounded p-2"
              onChange={(e) => {
                setSpaceName(e.target.value);
              }}
            />
          </label>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter className="flex justify-end space-x-2">
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
    <div className="flex flex-col gap-16 items-center justify-center h-screen">
      <div className="flex flex-col items-center font-bold">
        <span className="text-[64px]">Honey Flow</span>
        <span className="text-[16px]">
          끈적끈적 꿀처럼 이루어지는 협업 지식 관리 툴 🍯
        </span>
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
  );
}
