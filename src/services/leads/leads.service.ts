import axiosApi from "@/shared/api/axios";
import type {
  LeadCreatedResponse,
  LeadInput,
} from "@/features/leads/model/leads.types";

export async function createLead(input: LeadInput) {
  const { data } = await axiosApi.post<LeadCreatedResponse>(
    "/api/leads",
    input,
  );

  return data;
}
