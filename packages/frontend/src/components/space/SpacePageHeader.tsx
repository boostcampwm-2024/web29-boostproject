import { useEffect, useState } from "react";

import { BreadcrumbItem } from "shared/types";

import { getBreadcrumbOfSpace } from "@/api/space";
import { prompt } from "@/lib/prompt-dialog";

import SpaceBreadcrumb from "../SpaceBreadcrumb";
import SpaceShareAlertContent from "../SpaceShareAlertContent";
import SpaceUsersIndicator from "../SpaceUsersIndicator";
import { Button } from "../ui/button";

type SpacePageHeaderProps = {
  spaceId: string;
};

export default function SpacePageHeader({ spaceId }: SpacePageHeaderProps) {
  const [spacePaths, setSpacePaths] = useState<BreadcrumbItem[] | null>(null);

  useEffect(() => {
    async function fetchSpacePaths() {
      const data = await getBreadcrumbOfSpace(spaceId);
      setSpacePaths(data);
    }

    fetchSpacePaths();
  }, [spaceId]);

  return (
    <header className="fixed z-20 top-0 inset-x-0 h-16 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-6 h-full flex flex-row items-center justify-between">
        <div className="flex-1">
          {spacePaths && <SpaceBreadcrumb spacePaths={spacePaths} />}
        </div>
        <div className="flex-grow-0 flex flex-row justify-center items-center">
          <SpaceUsersIndicator />
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => {
              prompt("공유", <SpaceShareAlertContent />).catch(() => {});
            }}
          >
            공유
          </Button>
        </div>
      </div>
    </header>
  );
}
