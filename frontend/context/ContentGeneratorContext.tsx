"use client";

import { createContext, useContext } from "react";
import { useContentGenerator } from "@/hooks/useContentGenerator";

type ContentGeneratorContextType = ReturnType<typeof useContentGenerator>;

const ContentGeneratorContext =
  createContext<ContentGeneratorContextType | null>(null);

export function ContentGeneratorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const generator = useContentGenerator();

  return (
    <ContentGeneratorContext.Provider value={generator}>
      {children}
    </ContentGeneratorContext.Provider>
  );
}

export function useGenerator() {
  const context = useContext(ContentGeneratorContext);

  if (!context) {
    throw new Error(
      "useGenerator harus digunakan di dalam ContentGeneratorProvider"
    );
  }

  return context;
}