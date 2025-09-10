import { useMemo } from "react";
import type { ReactNode } from "react";
import { useGetUser } from "@/lib/api/queries";
// import type { User } from "@/components/types";

import { UserContext } from "./user-context";


export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error } = useGetUser();

  const value = useMemo(() => ({ user, isLoading, error }), [user, isLoading, error]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
