import { useContext } from "react";
import { ProfileUpdateContext } from "../contexts/profile-context";
import type { User } from "@xborg/shared/all";

export default function useSetProfile() {
  const setProfile = useContext(ProfileUpdateContext);
  return (nextProfile: User) => setProfile?.(nextProfile);
}
