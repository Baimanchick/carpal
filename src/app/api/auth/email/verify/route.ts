import {
  createJsonProxyResponse,
  getBackendAuthUrl,
  writeSessionCookie,
} from "@/app/api/auth/_lib/session";

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(getBackendAuthUrl("/auth/email/verify"), {
    method: "POST",
    body,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
  });
  const nextResponse = createJsonProxyResponse(response, await response.text());
  const setCookieHeader = response.headers.get("set-cookie");
  const tokenMatch = setCookieHeader?.match(/carpal_session=([^;]+)/);

  if (tokenMatch?.[1]) {
    writeSessionCookie(nextResponse, tokenMatch[1]);
  }

  return nextResponse;
}
