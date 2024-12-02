import { Link } from "react-router-dom";

import { BreadcrumbItem as BreadcrumbItemData } from "shared/types";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function splitSpacePaths(
  spacePaths: BreadcrumbItemData[],
  itemCountToDisplay: number,
) {
  const itemCount = spacePaths.length;

  // 처음 스페이스는 무조건 보여준다.
  const firstSpacePath = itemCount > 1 ? spacePaths[0] : null;

  // 중간 스페이스들은 ...으로 표시하고, 클릭 시 드롭다운 메뉴로 보여준다.
  const hiddenSpacePaths = spacePaths.slice(1, -itemCountToDisplay + 1);

  // 마지막 (n-1)개 스페이스는 무조건 보여준다.
  const shownSpacePathCount = Math.min(itemCount, itemCountToDisplay) - 1;
  const shownSpacePaths = spacePaths.slice(-shownSpacePathCount);

  return [firstSpacePath, hiddenSpacePaths, shownSpacePaths] as const;
}

type HiddenItemsProps = {
  spacePaths: BreadcrumbItemData[];
};

function HiddenItems({ spacePaths }: HiddenItemsProps) {
  return (
    <>
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BreadcrumbEllipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {spacePaths.map(({ name, url }) => (
              <DropdownMenuItem key={url} asChild>
                <Link to={`/space/${url}`}>{name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

type SpaceBreadcrumbItemProps = {
  spacePath: BreadcrumbItemData;
  isPage?: boolean;
};

function SpaceBreadcrumbItem({ spacePath, isPage }: SpaceBreadcrumbItemProps) {
  if (isPage) {
    return (
      <BreadcrumbItem>
        <BreadcrumbPage className="truncate max-w-20">
          {spacePath.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link className="truncate max-w-20" to={`/space/${spacePath.url}`}>
            {spacePath.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

type SpaceBreadcrumbProps = {
  spacePaths: BreadcrumbItemData[];
  itemCountToDisplay?: number;
};

export default function SpaceBreadcrumb({
  spacePaths,
  itemCountToDisplay = 3,
}: SpaceBreadcrumbProps) {
  // [처음, (...중간...), 직전, 현재]
  const [firstSpacePath, hiddenSpacePaths, shownSpacePaths] = splitSpacePaths(
    spacePaths,
    itemCountToDisplay,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {firstSpacePath && <SpaceBreadcrumbItem spacePath={firstSpacePath} />}
        {hiddenSpacePaths.length > 0 && (
          <HiddenItems spacePaths={hiddenSpacePaths} />
        )}
        {shownSpacePaths.map((spacePath, index) => (
          <SpaceBreadcrumbItem
            key={spacePath.url}
            spacePath={spacePath}
            isPage={index === shownSpacePaths.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
