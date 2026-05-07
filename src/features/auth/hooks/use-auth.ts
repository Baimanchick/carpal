"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model/auth-store";
import {
  getCurrentUser,
  logout,
  requestEmailOtp,
  verifyEmailOtp,
} from "@/services/auth/auth.service";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthBootstrap() {
  const hydrate = useAuthStore((store) => store.hydrate);
  const query = useQuery({
    queryKey: authMeQueryKey,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      hydrate(query.data);
      return;
    }

    if (query.isError) {
      hydrate(null);
    }
  }, [hydrate, query.data, query.isError, query.isSuccess]);

  return query;
}

export function useRequestEmailOtpMutation() {
  return useMutation({
    mutationFn: requestEmailOtp,
  });
}

export function useVerifyEmailOtpMutation() {
  const queryClient = useQueryClient();
  const hydrate = useAuthStore((store) => store.hydrate);

  return useMutation({
    mutationFn: verifyEmailOtp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authMeQueryKey,
      });
      const user = await queryClient.fetchQuery({
        queryKey: authMeQueryKey,
        queryFn: getCurrentUser,
      });

      hydrate(user);
      queryClient.setQueryData(authMeQueryKey, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const hydrate = useAuthStore((store) => store.hydrate);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      hydrate(null);
      queryClient.setQueryData(authMeQueryKey, null);
    },
  });
}
