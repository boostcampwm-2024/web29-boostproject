import { ReactNode } from "react";

import buzzyLogo from "@/assets/error-logo.svg";

type ErrorSectionProps = {
  description: string;
  RestoreActions?: () => ReactNode;
};

export default function ErrorSection({
  description,
  RestoreActions,
}: ErrorSectionProps) {
  return (
    <div className="container mx-auto px-6 h-full text-center">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <img src={buzzyLogo} className="w-36" />
        <div className="mt-8 text-base">
          <p>{description}</p>
        </div>
        {RestoreActions && (
          <div className="mt-12">
            <RestoreActions />
          </div>
        )}
      </div>
    </div>
  );
}
