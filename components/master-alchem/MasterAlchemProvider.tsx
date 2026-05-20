"use client";

import type { ReactNode } from "react";
import { MasterAlchemGuide } from "@/components/master-alchem/MasterAlchemGuide";

export function MasterAlchemProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MasterAlchemGuide />
    </>
  );
}

