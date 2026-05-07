import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = process.env.API_URL;

  if (!backendUrl) {
    return NextResponse.redirect(
      new URL("/login?error=google_misconfigured", request.url),
    );
  }

  const response = await fetch(`${backendUrl}/auth/google/login`, {
    cache: "no-store",
    redirect: "manual",
  });
  const location = response.headers.get("location");

  if (location) {
    return NextResponse.redirect(location);
  }

  return NextResponse.redirect(
    new URL("/login?error=google_unavailable", request.url),
  );
}
