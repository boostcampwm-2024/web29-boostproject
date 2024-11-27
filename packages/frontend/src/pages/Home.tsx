import { FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { createSpace } from "@/api/space";
import logo from "@/assets/logo.svg";
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

async function requestCreateSpace(spaceName: string) {
  return createSpace({
    userId: "honeyflow", // TODO: get user id from auth
    spaceName,
    parentContextNodeId: null,
  });
}

type CreateSpaceButtonProps = {
  navigate: NavigateFunction;
};

function CreateSpaceButton({ navigate }: CreateSpaceButtonProps) {
  const [spaceName, setSpaceName] = useState("");
  const [error, setError] = useState("");
  const handleCreateSpace = (e: FormEvent) => {
    e.preventDefault();
    const targetSpaceName = spaceName.trim();

    if (targetSpaceName === "") {
      setError("이름을 입력해주세요.");
      return;
    }

    requestCreateSpace(targetSpaceName)
      .then((res) => {
        const { urlPath } = res;
        navigate(`/space/${urlPath}`);
      })
      .catch((error) => {
        setError(`스페이스 생성에 실패했어요. (${error})`);
      });
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
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button type="submit">생성</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type JoinSpaceButtonProps = {
  navigate: NavigateFunction;
};

function JoinSpaceButton({ navigate }: JoinSpaceButtonProps) {
  const [spaceId, setSpaceId] = useState("");
  const [error, setError] = useState("");
  const handleCreateSpace = (e: FormEvent) => {
    e.preventDefault();
    const targetSpaceId = spaceId.trim();

    if (targetSpaceId === "") {
      setError("코드를 입력해주세요.");
      return;
    }

    // TODO: 존재하는 스페이스인지 체크할 수 있음 좋을 듯
    navigate(`/space/${targetSpaceId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">스페이스 입장</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>스페이스 들어가기</DialogTitle>
          <DialogDescription>
            기존 스페이스에 들어가기 위한 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateSpace}>
          <Label>
            스페이스 코드
            <Input
              className="mt-1"
              type="text"
              onChange={(e) => {
                setSpaceId(e.target.value);
              }}
            />
          </Label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button type="submit">들어가기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const navigate = useNavigate();

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
          <CreateSpaceButton navigate={navigate} />
          <JoinSpaceButton navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
