import axios, { AxiosError } from "axios";

const axiosApi = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type ApiErrorDetail =
  | string
  | {
      code?: string;
      detail?: string;
    };

type ApiErrorBody = {
  code?: string;
  detail?: ApiErrorDetail;
  message?: string;
};

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

axiosApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 500;
    const body = error.response?.data as ApiErrorBody | undefined;
    const nestedDetail =
      typeof body?.detail === "object" ? body.detail.detail : undefined;
    const code =
      typeof body?.detail === "object" ? body.detail.code : body?.code;
    const message =
      nestedDetail ||
      (typeof body?.detail === "string" ? body.detail : undefined) ||
      body?.message ||
      error.message;

    return Promise.reject(new ApiError(message, status, code));
  },
);

export default axiosApi;
