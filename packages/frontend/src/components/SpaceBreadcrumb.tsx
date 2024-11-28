import { Link } from "react-router-dom";

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

type SpacePath = {
  name: string;
  urlPath: string;
};

type HiddenItemsProps = {
  spacePaths: SpacePath[];
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
            {spacePaths.map(({ name, urlPath }) => (
              <DropdownMenuItem key={urlPath} asChild>
                <Link to={`/space/${urlPath}`}>{name}</Link>
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
  spacePath: SpacePath;
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
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link className="truncate max-w-20" to={`/space/${spacePath.urlPath}`}>
          {spacePath.name}
        </Link>
      </BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
  );
}

type SpaceBreadcrumbProps = {
  spacePaths: SpacePath[];
  itemCountToDisplay?: number;
};

export default function SpaceBreadcrumb({
  spacePaths,
  itemCountToDisplay = 3,
}: SpaceBreadcrumbProps) {
  // [처음, (...중간...), 직전, 현재]

  const firstSpacePath = spacePaths[0];
  const hiddenSpacePaths = spacePaths.slice(1, -2);
  const shownSpacePaths = spacePaths.slice(
    Math.max(-spacePaths.length + 1, -itemCountToDisplay + 1),
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
            key={spacePath.urlPath}
            spacePath={spacePath}
            isPage={index === shownSpacePaths.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
