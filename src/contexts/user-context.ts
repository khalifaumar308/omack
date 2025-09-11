import { createContext } from "react";
import type { PopulatedUser } from "@/components/types";

interface UserContextType {
  user: PopulatedUser | null | undefined;
  isLoading: boolean;
  error: unknown;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);