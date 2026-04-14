import { RegisterCredentials } from "../types";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function register({ name, email, password }: RegisterCredentials) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to register.");
  }

  return response.json();
}
