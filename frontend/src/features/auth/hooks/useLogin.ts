import { useAuth } from "./useAuth";

export function useLogin() {
  const { signIn, isLoading } = useAuth();
  return { signIn, isLoading };
}
