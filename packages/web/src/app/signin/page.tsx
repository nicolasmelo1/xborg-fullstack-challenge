"use client";

import { api, googleApi } from "../../api";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const { access_token } = tokenResponse;
      googleApi.getProfile(access_token).then((userInfo) => {
        console.log(userInfo);
        api
          .login({
            email: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            pictureUrl: userInfo.picture,
            id: userInfo.id,
          })
          .then((response) => {
            console.log(response);
          });
      });
    },
  });

  return (
    <div>
      <button onClick={() => login()}>Sign In</button>
    </div>
  );
}
