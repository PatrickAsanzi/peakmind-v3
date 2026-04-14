import { AuthTokenResponse, LoginCredentials } from "../types";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function login({
  email,
  password,
}: LoginCredentials): Promise<AuthTokenResponse> {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to sign in.");
  }

  return response.json();
}
