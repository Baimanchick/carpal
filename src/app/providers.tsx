"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap";
import { AuthStoreProvider } from "@/features/auth/model/auth-store";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStoreProvider>
        <TooltipProvider>
          <AuthBootstrap />
          {children}
        </TooltipProvider>
      </AuthStoreProvider>
    </QueryClientProvider>
  );
}
