import { createContext, useContext, ReactNode } from "react";
import { useGetMe, useLogin, useLogout, type AuthUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type AuthCtx = {
  user: AuthUser | undefined;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const meQ = useGetMe();
  const loginM = useLogin();
  const logoutM = useLogout();

  const value: AuthCtx = {
    user: meQ.data,
    isLoading: meQ.isLoading,
    login: async (username, password) => {
      const u = await loginM.mutateAsync({ data: { username, password } });
      await qc.invalidateQueries();
      return u;
    },
    logout: async () => {
      await logoutM.mutateAsync();
      qc.clear();
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
}
