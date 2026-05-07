"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { AuthUser } from "./auth.types";

type AuthState = {
  isInitialized: boolean;
  user: AuthUser | null;
};

type AuthActions = {
  hydrate: (user: AuthUser | null) => void;
};

type AuthStore = AuthState & AuthActions;
type AuthStoreApi = ReturnType<typeof createAuthStore>;

const defaultState: AuthState = {
  isInitialized: false,
  user: null,
};

const AuthStoreContext = createContext<AuthStoreApi | null>(null);

function createAuthStore(initState: AuthState = defaultState) {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    hydrate: (user) =>
      set({
        isInitialized: true,
        user,
      }),
  }));
}

export function AuthStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAuthStore());

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (store: AuthStore) => T) {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error("useAuthStore must be used within AuthStoreProvider");
  }

  return useStore(store, selector);
}
