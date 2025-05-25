import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ulid } from "ulid";
import type { ClassValue } from "clsx";
import { SignInResponse } from "next-auth/react";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function createId() {
  return ulid();
}

export async function promiseTimeout(delayInMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMs);
  });
}

export interface AuthErrorType {
  code?: string;
  message?: string;
  status: number;
  statusText: string;
}

export function handleAuthResponse(response: SignInResponse) {
  if (response.error) {
    throw new AuthError({
      message: response.error,
      status: 400,
      statusText: response.error,
    });
  }

  return response;
}

export class UserViewableError {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export class AuthError extends Error {
  error: AuthErrorType;

  constructor(error: AuthErrorType) {
    super(error.message);
    this.error = error;
  }
}

export function getSidebarStateFromCookie(): boolean {
  const cookies = document.cookie.split(";");
  const sidebarCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("sidebar:state=")
  );
  return sidebarCookie ? sidebarCookie.split("=")[1] === "true" : true;
}

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<ErrorType> = {
  data: null;
  error: ErrorType;
};

type Result<T, Err = Error> = Success<T> | Failure<Err>;

// Main wrapper function
export async function tryCatch<T, Err = Error>(
  promise: Promise<T>
): Promise<Result<T, Err>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Err };
  }
}

const TOKEN_NAME = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_NAME);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_NAME, token);
}

export function getRelativeTimeString(date: Date): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInSecs) < 60) {
    return formatter.format(0, "seconds");
  } else if (Math.abs(diffInMins) < 60) {
    return formatter.format(diffInMins, "minutes");
  } else if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hours");
  } else {
    return formatter.format(diffInDays, "days");
  }
}
