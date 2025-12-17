"use client";

import { useEffect } from "react";

export default function SignInCallback() {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    window.opener?.postMessage(
      error
        ? { type: "oauth:google:error", error }
        : { type: "oauth:google:success" },
      window.location.origin,
    );
    //window.close();
  }, []);

  return <>Redirecting you back to the application...</>;
}
