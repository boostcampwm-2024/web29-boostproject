import { Link } from "react-router-dom";

import { MoveLeftIcon } from "lucide-react";

import ErrorSection from "@/components/ErrorSection";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <ErrorSection
      description="찾을 수 없는 페이지예요"
      RestoreActions={() => (
        <Button asChild>
          <Link to="/">
            <MoveLeftIcon />
            처음으로 돌아가기
          </Link>
        </Button>
      )}
    />
  );
}
