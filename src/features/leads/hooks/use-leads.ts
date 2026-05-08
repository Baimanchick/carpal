"use client";

import { useMutation } from "@tanstack/react-query";
import { createLead } from "@/services/leads/leads.service";

export function useCreateLeadMutation() {
  return useMutation({
    mutationFn: createLead,
  });
}
