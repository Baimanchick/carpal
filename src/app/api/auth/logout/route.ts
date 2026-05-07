import {
  clearSessionCookie,
  getBackendAuthUrl,
  readSessionToken,
} from "@/app/api/auth/_lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = readSessionToken(request);

  if (token) {
    await fetch(getBackendAuthUrl("/auth/logout"), {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true });

  clearSessionCookie(response);

  return response;
}
