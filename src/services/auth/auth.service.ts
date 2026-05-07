import axiosApi, { ApiError } from "@/shared/api/axios";
import type {
  AuthUser,
  EmailOtpRequestInput,
  EmailOtpRequestResponse,
  EmailOtpVerifyInput,
  EmailOtpVerifyResponse,
} from "@/features/auth/model/auth.types";

export async function requestEmailOtp(payload: EmailOtpRequestInput) {
  const { data } = await axiosApi.post<EmailOtpRequestResponse>(
    "/api/auth/email/request",
    payload,
  );

  return data;
}

export async function verifyEmailOtp(payload: EmailOtpVerifyInput) {
  const { data } = await axiosApi.post<EmailOtpVerifyResponse>(
    "/api/auth/email/verify",
    payload,
  );

  return data;
}

export async function getCurrentUser() {
  try {
    const { data } = await axiosApi.get<AuthUser>("/api/auth/me");

    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function logout() {
  await axiosApi.post("/api/auth/logout");
}
