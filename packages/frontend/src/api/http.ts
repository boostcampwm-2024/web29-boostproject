// TODO: 에러 타입 핸들링
class HttpResponseError extends Error {
  constructor(response: Response) {
    super(`HTTP error: ${response.status} ${response.statusText}`);
  }
}

type HttpResponse<T> = {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  config: RequestInit;
  request: Request;
};

async function http<T>(
  url: string,
  config: RequestInit,
): Promise<HttpResponse<T>> {
  const request = new Request(url, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  });
  const response = await fetch(request);

  if (!response.ok) {
    throw new HttpResponseError(response);
  }

  // json으로 한정
  const data = config.method === "DELETE" ? null : await response.json();

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config,
    request,
  };
}

http.get = function <T>(url: string, config?: Omit<RequestInit, "method">) {
  return http<T>(url, { ...config, method: "GET" });
};
http.post = function <T>(url: string, config?: Omit<RequestInit, "method">) {
  return http<T>(url, { ...config, method: "POST" });
};
http.put = function <T>(url: string, config?: Omit<RequestInit, "method">) {
  return http<T>(url, { ...config, method: "PUT" });
};
http.patch = function <T>(url: string, config?: Omit<RequestInit, "method">) {
  return http<T>(url, { ...config, method: "PATCH" });
};
http.delete = function <T>(url: string, config?: Omit<RequestInit, "method">) {
  return http<T>(url, { ...config, method: "DELETE" });
};

export type { HttpResponse };

export { HttpResponseError };

export default http;
