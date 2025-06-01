import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { authQueries } from "src/services/queries";

export function useLoggedInRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = authQueries.user();
    if (user) {
      router.navigate({ to: "/" });
    }
  }, []);
}
