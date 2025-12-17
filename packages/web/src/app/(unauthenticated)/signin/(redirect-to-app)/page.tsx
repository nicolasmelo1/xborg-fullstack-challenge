"use client";

import { useEffect } from "react";
import { API_HOST } from "../../../../api";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function login() {
    const w = 520;
    const h = 650;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const loginUrl = new URL("/auth/login/google", API_HOST);
    loginUrl.searchParams.set(
      "redirectUrl",
      `${window.location.href}/callback`,
    );

    const popup = window.open(
      loginUrl.toString(),
      "google_oauth",
      `width=${w},height=${h},left=${left},top=${top}`,
    );

    // fallback if popup blocked
    if (!popup) window.location.href = loginUrl.toString();
  }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "oauth:google:success") router.push("/profile");
      if (e.data?.type === "oauth:google:error")
        router.push(`/signin?error=${encodeURIComponent(e.data.error)}`);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-neutral-200">
        <header className="space-y-2">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Welcome
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Sign in to continue
          </h1>
          <p className="text-sm text-neutral-500">
            We will redirect you to Google, then back here to finish login.
          </p>
        </header>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          onClick={() => login()}
        >
          Sign in with Google
        </button>
        {searchParams.get("error") && (
          <p className="text-sm text-red-500">{searchParams.get("error")!}</p>
        )}
      </div>
    </main>
  );
}
