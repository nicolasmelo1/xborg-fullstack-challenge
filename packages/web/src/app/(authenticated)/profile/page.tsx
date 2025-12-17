"use client";

import { api } from "../../../api";
import { useRouter } from "next/navigation";
import useProfile from "../../../hooks/use-profile";
import useSetProfile from "../../../hooks/use-set-profile";
import { useEffect, useMemo, useState } from "react";
import type { UpdateUserInput } from "@xborg/shared/all";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export default function Profile() {
  const router = useRouter();
  const profile = useProfile();
  const setProfile = useSetProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [values, setValues] = useState<ProfileFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    picture: "",
  });
  const [initialValues, setInitialValues] = useState<ProfileFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    picture: "",
  });

  const displayName = useMemo(() => {
    const firstName = profile?.firstName?.trim() ?? "";
    const lastName = profile?.lastName?.trim() ?? "";
    const full = `${firstName} ${lastName}`.trim();
    return full || profile?.email || "User";
  }, [profile?.email, profile?.firstName, profile?.lastName]);

  const avatarFallback = useMemo(() => {
    const name = displayName.trim();
    const letter = name ? name[0]?.toUpperCase() : "U";
    return letter ?? "U";
  }, [displayName]);

  const isDirty = useMemo(() => {
    return (
      values.email !== initialValues.email ||
      values.firstName !== initialValues.firstName ||
      values.lastName !== initialValues.lastName ||
      values.picture !== initialValues.picture
    );
  }, [initialValues, values]);

  async function logout() {
    setIsLoggingOut(true);
    api
      .logout()
      .then(() => router.push("/signin"))
      .finally(() => setIsLoggingOut(false));
  }

  async function onSubmit(nextValues: ProfileFormValues) {
    if (!profile) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const payload: UpdateUserInput = {
        externalId: profile.externalId,
        email: nextValues.email.trim(),
        firstName: nextValues.firstName.trim() || null,
        lastName: nextValues.lastName.trim() || null,
        picture: nextValues.picture.trim() || null,
      };
      const ok = await api.updateProfile(payload);
      if (!ok) throw new Error("Update failed");
      setSaveSuccess(true);
      setProfile({
        ...profile,
        email: payload.email ?? "",
        firstName: payload.firstName ?? null,
        lastName: payload.lastName ?? null,
        picture: payload.picture ?? null,
        updatedAt:
          new Date().toISOString() as unknown as (typeof profile)["updatedAt"],
      });
      setInitialValues(nextValues);
    } catch (error) {
      setSaveError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!profile) return;
    const nextValues = {
      email: profile.email ?? "",
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      picture: profile.picture ?? "",
    };
    setValues(nextValues);
    setInitialValues(nextValues);
  }, [profile]);

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <header className="sticky top-0 z-10 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
              {profile?.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.picture}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-neutral-700">
                  {avatarFallback}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-neutral-900">
                {displayName}
              </div>
              <div className="truncate text-sm text-neutral-500">
                {profile?.email}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={logout}
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-2xl">
          <CardHeader className="pb-4 md:p-8 md:pb-5">
            <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">
              Profile
            </CardTitle>
            <CardDescription>
              Edit your details and save changes.
            </CardDescription>
          </CardHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit(values);
            }}
          >
            <CardContent className="grid gap-5 pt-0 md:p-8 md:pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g. Nicolas"
                    autoComplete="given-name"
                    value={values.firstName}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g. Melo"
                    autoComplete="family-name"
                    value={values.lastName}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="picture">Picture URL</Label>
                <Input
                  id="picture"
                  type="url"
                  placeholder="https://..."
                  autoComplete="url"
                  value={values.picture}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      picture: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-neutral-500">
                  Used for your avatar in the header.
                </p>
              </div>
            </CardContent>

            <CardFooter className="justify-between md:p-8 md:pt-0">
              <div className="text-sm">
                {saveError ? (
                  <span className="text-red-600">{saveError}</span>
                ) : saveSuccess ? (
                  <span className="text-green-700">Saved</span>
                ) : (
                  <span className="text-neutral-500">
                    Make changes and click Save.
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={!profile || isSaving || !isDirty}
                className="gap-2"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
