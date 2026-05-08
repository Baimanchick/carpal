function getBackendLeadsUrl() {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  return `${apiUrl}/leads`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(getBackendLeadsUrl(), {
    method: "POST",
    body,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "application/json",
    },
  });
}
