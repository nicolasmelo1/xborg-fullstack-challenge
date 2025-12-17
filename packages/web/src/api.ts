import type { UpdateUserInput } from "@xborg/shared/all";

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

export async function fetchWithRefreshToken(
  input: RequestInfo | URL,
  init?: RequestInit,
  isRefresh: boolean = false,
) {
  const isServer = typeof window === "undefined";
  const getCookies = async () => {
    if (isServer) {
      const { cookies } = await import("next/headers");
      return (await cookies()).toString(); // server
    }
    return undefined;
  };

  const doFetch = async (cookies?: string | undefined) => {
    const maybeCookies = cookies ?? (await getCookies());
    const initClientOrServer = (
      maybeCookies
        ? {
            ...init,
            headers: {
              ...init?.headers,
              cookie: maybeCookies,
            },
            cache: "no-store",
          }
        : {
            ...init,
            credentials: "include",
          }
    ) as RequestInit;
    return await fetch(input, initClientOrServer);
  };
  let response = await doFetch();
  if (
    isRefresh !== true &&
    typeof response === "object" &&
    response.status === 401
  ) {
    response = await api.refresh();
    if (response.ok) {
      return doFetch(
        isServer
          ? (response.headers.get("set-cookie") ?? undefined)
          : undefined,
      );
    }
  }
  return response;
}

export const api = {
  refresh: async () => {
    const url = new URL("/auth/refresh", API_HOST);
    const response = await fetchWithRefreshToken(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
      true,
    );
    return response;
  },

  login: async (body: { code: string }) => {
    const url = new URL("/auth/login/google", API_HOST);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    return response.ok;
  },

  logout: async () => {
    const url = new URL("/auth/logout", API_HOST);
    const response = await fetchWithRefreshToken(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.ok;
  },

  getProfile: async () => {
    const url = new URL("user/profile", API_HOST);
    const response = await fetchWithRefreshToken(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.json();
  },

  updateProfile: async (body: UpdateUserInput) => {
    const url = new URL("user/profile", API_HOST);
    const response = await fetchWithRefreshToken(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    return response.ok;
  },
};
