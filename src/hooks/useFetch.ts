import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
  QueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { BANDO_API_URL } from "../config/constants";

type FetchOptions<T> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  queryParams?: Record<string, string | number>;
  queryOptions?: UseQueryOptions<T, Error>;
  mutationOptions?: UseMutationOptions<T, Error, unknown, unknown>;
  useFullUrl?: boolean;
  enabled?: boolean;
};

function buildQueryString(queryParams: Record<string, string | number> = {}) {
  const query = new URLSearchParams(queryParams as Record<string, string>);
  return query.toString() ? `?${query.toString()}` : "";
}

async function fetchData<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
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
}: FetchOptions<T>): any {
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const queryString = buildQueryString(queryParams);
  const fullUrl = !useFullUrl ? `${url}${queryString}` : `${BANDO_API_URL}${url}${queryString}`;

  if (method === "GET") {
    return useQuery<T>({
      queryKey: [url, queryParams],
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
          body: mutationData ? JSON.stringify(mutationData) : undefined,
        };
        return fetchData<T>(fullUrl, dynamicOptions);
      },
      ...mutationOptions,
    });
  }
}
