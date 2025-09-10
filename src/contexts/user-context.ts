import { createContext } from "react";
import type { User } from "@/components/types";

interface UserContextType {
  user: User | null | undefined;
  isLoading: boolean;
  error: unknown;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);