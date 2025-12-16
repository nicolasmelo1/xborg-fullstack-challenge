"use client";

import { api } from "../../../api";
import { useRouter } from "next/navigation";
import useProfile from "../../../hooks/use-profile";

export default function Profile() {
  const router = useRouter();
  const profile = useProfile();

  const logout = () => {
    api.logout().then(() => router.push("/signin"));
  };

  return (
    <div>
      <h1>Profile</h1>

      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
