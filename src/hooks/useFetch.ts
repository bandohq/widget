import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
  QueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { BANDO_API_URL } from "../config/constants";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";

type FetchOptions<T> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  queryParams?: Record<string, string | number>;
  queryOptions?: UseQueryOptions<T, Error>;
  mutationOptions?: UseMutationOptions<T, Error, unknown, unknown>;
  useFullUrl?: boolean;
  enabled?: boolean;
  headers?: Record<string, string>;
};

function buildQueryString(queryParams: Record<string, string | number> = {}) {
  const query = new URLSearchParams(queryParams as Record<string, string>);
  return query.toString() ? `?${query.toString()}` : "";
}

async function fetchData<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  const rawBody = await response.text();
  let parsedBody: any;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedBody = rawBody; // was not JSON
  }

  if (!response.ok) {
    const errorMessage =
      parsedBody?.message ||
      parsedBody?.data?.error_code ||
      `Error: ${response.status}`;

    // Extend Error to attach extra info
    const err = new Error(errorMessage) as Error & {
      status: number;
      data: unknown;
      errorCode?: string;
      fields?: Record<string, string>;
    };

    err.status = response.status;
    err.data = parsedBody;

    // Add errorCode and fields from the backend response
    if (parsedBody?.errorCode) {
      err.errorCode = parsedBody.errorCode;
    }
    if (parsedBody?.fields) {
      err.fields = parsedBody.fields;
    }

    throw err;
  }

  return parsedBody as T;
}


/**
 * Overloads to ensure TypeScript correctly infers the return type based on the method
 */
export function useFetch<T = any>(
  options: FetchOptions<T> & { method: "GET" }
): QueryObserverResult<T, Error>;

export function useFetch<T = any>(
  options: FetchOptions<T> & { method: "POST" | "PUT" | "DELETE" }
): UseMutationResult<T, Error, unknown, unknown>;

export function useFetch<T = any>({
  url,
  method = "GET",
  data,
  queryParams,
  queryOptions,
  mutationOptions,
  useFullUrl = true,
  enabled = true,
  headers,
}: FetchOptions<T>): any {
  const { integrator } = useWidgetConfig();

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  // Automatically include integrator in query params
  const finalQueryParams = {
    integrator,
    ...queryParams,
  };

  const queryString = buildQueryString(finalQueryParams);
  const fullUrl = !useFullUrl
    ? `${url}${queryString}`
    : `${BANDO_API_URL}${url}${queryString}`;

  if (method === "GET") {
    return useQuery<T>({
      queryKey: [url, finalQueryParams],
      queryFn: () => fetchData<T>(fullUrl, fetchOptions),
      enabled,
      ...queryOptions,
    });
  } else {
    return useMutation<T, Error, unknown, unknown>({
      mutationKey: [url],
      mutationFn: (mutationData) => {
        const dynamicOptions: RequestInit = {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
          },
          body: mutationData ? JSON.stringify(mutationData) : undefined,
        };
        return fetchData<T>(fullUrl, dynamicOptions);
      },
      ...mutationOptions,
    });
  }
}
