import SpaceBreadcrumb from "../SpaceBreadcrumb";
import { Button } from "../ui/button";

export default function SpacePageHeader() {
  return (
    <header className="fixed z-20 top-0 inset-x-0 h-16 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-6 h-full flex flex-row items-center justify-between">
        <div className="flex-1">
          <SpaceBreadcrumb
            spacePaths={[
              { name: "하나", urlPath: "1" },
              { name: "셋", urlPath: "3" },
              { name: "넷", urlPath: "4" },
              { name: "다섯", urlPath: "5" },
              { name: "여섯", urlPath: "6" },
              { name: "일곱", urlPath: "7" },
              { name: "여덟", urlPath: "8" },
              { name: "아홉", urlPath: "9" },
              {
                name: "엄청 긴 제목을 가진 스페이스다아아아아아아아아아아아아아",
                urlPath: "2",
              },
              { name: "열", urlPath: "10" },
            ]}
          />
        </div>
        <div className="flex-0">
          <Button variant="outline">공유</Button>
        </div>
      </div>
    </header>
  );
}
