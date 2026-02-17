"use client";

import React, { createContext, useContext } from "react";
import type { UserRole } from "@/lib/types";

interface RoleContextValue {
  role: UserRole | null;
}

const RoleContext = createContext<RoleContextValue>({ role: null });

export function RoleProvider({ role, children }: { role: UserRole | null; children: React.ReactNode }) {
  return <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
