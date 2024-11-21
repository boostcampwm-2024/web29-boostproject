import { createContext, useContext } from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default {};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSafeContext<T>(defaultValue?: T) {
  const MyContext = createContext<T | undefined>(defaultValue);

  function useMyContext() {
    const context = useContext(MyContext);

    if (context === undefined) {
      throw new Error("Provider 없음");
    }

    return context;
  }

  return [useMyContext, MyContext.Provider] as const;
}
