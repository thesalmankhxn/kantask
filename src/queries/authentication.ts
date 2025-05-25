import { handleAuthResponse } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { signIn, SignInResponse } from "next-auth/react";

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await signIn("google");
      return handleAuthResponse(res as unknown as SignInResponse);
    },
  });
}

export function useGithubLoginMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await signIn("github");
      console.log("GITHUB res", res);
      return handleAuthResponse(res as unknown as SignInResponse);
    },
  });
}
