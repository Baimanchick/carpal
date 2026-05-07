type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  method?: FetchMethod;
  data?: unknown;
  timeout?: number;
}

type FetchFunction = <ResponseType, Body>(
  url: string,
  data?: Body,
  o?: Omit<FetchOptions, "data" | "method">,
) => Promise<ResponseType>;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const createFetchClient = (baseURL: string) => {
  const requestInterceptor = async (url: string, opts: FetchOptions) => {
    return [
      baseURL + url,
      {
        ...opts,
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
          ...(opts.headers || {}),
        },
        body: opts.data != null ? JSON.stringify(opts.data) : undefined,
      } as RequestInit,
    ];
  };
  const responseInterceptor = async (res: Response) => {
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      const error = new Error(errBody?.message || res.statusText);

      throw error;
    }
    return res.json();
  };

  const fetchClient = async (url: string, opts: FetchOptions = {}) => {
    const controller = new AbortController();
    const timeoutId = opts.timeout
      ? setTimeout(() => controller.abort(), opts.timeout)
      : null;

    try {
      const [fullUrl, init] = await requestInterceptor(url, {
        method: opts.method || "GET",
        ...opts,
        signal: controller.signal,
      });
      const res = await fetch(fullUrl as string, init as RequestInit);
      return await responseInterceptor(res);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };
  const methods: Record<Lowercase<FetchMethod>, FetchFunction> = {} as Record<
    Lowercase<FetchMethod>,
    FetchFunction
  >;

  (["GET", "POST", "PUT", "DELETE", "PATCH"] as FetchMethod[]).forEach(
    (method) => {
      methods[method.toLowerCase() as Lowercase<FetchMethod>] = (
        url: string,
        data?: unknown,
        o?: Omit<FetchOptions, "data" | "method">,
      ) => fetchClient(url, { method, data, ...o });
    },
  );

  return { request: fetchClient, ...methods };
};
const clientApi = createFetchClient("/api");

export default clientApi;
