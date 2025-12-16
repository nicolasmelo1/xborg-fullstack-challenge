import { api } from "../../api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";
import { ProfileProvider } from "../../contexts/profile-context";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const availableCookies = await cookies();
  const session = availableCookies.get(COOKIE_SESSION)?.value;
  const refreshToken = availableCookies.get(COOKIE_REFRESH_TOKEN)?.value;
  if (!session || !refreshToken) redirect("/signin");
  const profile = await api.getProfile();
  if (profile.statusCode === 401) redirect("/signin");

  return <ProfileProvider value={profile}>{children}</ProfileProvider>;
}
