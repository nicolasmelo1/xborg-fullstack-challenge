import { GoogleUserInfo } from "@xborg/shared/all";

const API_HOST = "http://localhost:3006";

export const googleApi = {
  getProfile: async (
    accessToken: string,
  ): Promise<{
    email: string;
    family_name: string;
    given_name: string;
    id: string;
    name: string;
    picture: string;
    verified_email: boolean;
  }> => {
    const url = new URL("/oauth2/v1/userinfo", "https://www.googleapis.com");
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
};

export const api = {
  login: async (userInfo: GoogleUserInfo) => {
    const url = new URL("/auth/login/google", API_HOST);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    });
    console.log(response.ok);
    console.log(response.status);
    console.log(await response.text());
    return response.json();
  },

  getProfile: async () => {
    const url = new URL("/profiles/me", API_HOST);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.json();
  },
};
