import { AuthUserProfile } from "../types";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

function parseJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token.");
  }

  const payload = JSON.parse(decodeBase64Url(parts[1]));
  return payload as {
    sub: string;
    email?: string;
    name?: string;
    [key: string]: unknown;
  };
}

export async function fetchProfile(): Promise<AuthUserProfile> {
  const token = localStorage.getItem("pm_token");
  if (!token) {
    throw new Error("No auth token found.");
  }

  const payload = parseJwt(token);
  const userId = payload.sub;
  if (!userId) {
    throw new Error("Invalid token payload.");
  }

  const response = await fetch(`${baseUrl}/auth/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to fetch profile.");
  }

  return response.json();
}
