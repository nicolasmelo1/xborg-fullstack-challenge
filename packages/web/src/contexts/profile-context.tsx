"use client";

import { User } from "@xborg/shared/all";
import { createContext, useEffect, useMemo, useState } from "react";

export const ProfileContext = createContext<User | null>(null);

export const ProfileUpdateContext = createContext<
  ((nextProfile: User) => void) | null
>(null);

export function ProfileProvider({
  value,
  children,
}: {
  value: User;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<User>(value);

  useEffect(() => {
    setProfile(value);
  }, [value]);

  const updateProfile = useMemo(() => setProfile, []);

  return (
    <ProfileContext.Provider value={profile}>
      <ProfileUpdateContext.Provider value={updateProfile}>
        {children}
      </ProfileUpdateContext.Provider>
    </ProfileContext.Provider>
  );
}
