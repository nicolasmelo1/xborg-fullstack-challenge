import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";
import { api } from "../api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const availableCookies = await cookies();
  const session = availableCookies.get(COOKIE_SESSION)?.value;
  const refreshToken = availableCookies.get(COOKIE_REFRESH_TOKEN)?.value;
  if (!session || !refreshToken) return redirect("/signin");

  const profile = await api.getProfile();
  if (profile.statusCode !== 401) redirect("/profile");
}
