import { createJsonProxyResponse, getBackendAuthUrl } from "@/app/api/auth/_lib/session";

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(getBackendAuthUrl("/auth/email/request"), {
    method: "POST",
    body,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
  });

  return createJsonProxyResponse(response, await response.text());
}
