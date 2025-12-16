"use client";

import { User } from "@xborg/shared/all";
import { createContext } from "react";

export const ProfileContext = createContext<User | null>(null);

export function ProfileProvider({
  value,
  children,
}: {
  value: User;
  children: React.ReactNode;
}) {
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
