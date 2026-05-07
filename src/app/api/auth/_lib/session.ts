import { NextResponse } from "next/server";

export const SESSION_COOKIE = "carpal_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getBackendAuthUrl(pathname: string) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  return `${apiUrl}${pathname}`;
}

export function createJsonProxyResponse(response: Response, body: string) {
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "application/json",
    },
  });
}

export function readSessionToken(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(
    new RegExp(`${SESSION_COOKIE}=([^;]+)`),
  );

  return match?.[1] ?? null;
}

export function writeSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
}
