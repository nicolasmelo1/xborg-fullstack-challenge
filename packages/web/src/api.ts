import type { UpdateUserInput } from "@xborg/shared/all";

const API_BASE_PATH = "/api";

async function getWebOrigin() {
  const isServer = typeof window === "undefined";
  if (!isServer) return window.location.origin;

  const { headers } = await import("next/headers");
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function apiUrl(path: string) {
  const origin = await getWebOrigin();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${API_BASE_PATH}${normalizedPath}`;
}

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
    const url = await apiUrl("/auth/refresh");
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
    const url = await apiUrl("/auth/login/google");
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
    const url = await apiUrl("/auth/logout");
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
    const url = await apiUrl("/user/profile");
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
    const url = await apiUrl("/user/profile");
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
