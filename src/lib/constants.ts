export function getOrigin() {
  if (typeof window === "undefined") {
    // Server-side: use environment variable or default
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }

  // Client-side: use window.location
  const origin = window.location.origin;

  // Remove trailing slash from origin if it exists
  if (origin[origin.length - 1] === "/") {
    return origin.slice(0, -1);
  }

  return origin;
}

export const isMac =
  typeof window !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;
