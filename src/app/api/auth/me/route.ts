import { createJsonProxyResponse, getBackendAuthUrl, readSessionToken } from "@/app/api/auth/_lib/session";

export async function GET(request: Request) {
  const token = readSessionToken(request);

  if (!token) {
    return new Response(JSON.stringify({ detail: "Authentication required" }), {
      status: 401,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const response = await fetch(getBackendAuthUrl("/auth/me"), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return createJsonProxyResponse(response, await response.text());
}
