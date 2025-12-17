import { ProfileContext } from "../contexts/profile-context";
import { useContext } from "react";

export default function useProfile() {
  const profile = useContext(ProfileContext);
  return profile;
}
