"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../api";

export default function SignInCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      const searchParams = new URLSearchParams();
      searchParams.set("error", "The code is missing");
      router.push(`/signin?${searchParams.toString()}`);
    } else {
      api
        .login({
          code,
        })
        .then((isOk) => {
          if (isOk) router.push("/profile");
          else {
            const searchParams = new URLSearchParams();
            searchParams.set(
              "error",
              "An unknown error occurred while trying to sign in",
            );
            router.push(`/signin?${searchParams.toString()}`);
          }
        })
        .catch(() => {
          const searchParams = new URLSearchParams();
          searchParams.set("error", "The code is invalid");
          router.push(`/signin?${searchParams.toString()}`);
        });
    }
  }, [router, searchParams]);

  return <>Redirecting you back to the application...</>;
}
