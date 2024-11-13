import { useQuery, useMutation, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { BANDO_API_URL } from '../config/constants';

type FetchOptions<T> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  queryParams?: Record<string, string | number>; 
  queryOptions?: UseQueryOptions<T>;       
  mutationOptions?: UseMutationOptions<T, Error, unknown, unknown>; 
};

function buildQueryString(queryParams: Record<string, string | number> = {}) {
  const query = new URLSearchParams(queryParams as Record<string, string>);
  return query.toString() ? `?${query.toString()}` : '';
}

async function fetchData<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

export function useFetch<T = any>({ url, method = 'GET', data, queryParams, queryOptions, mutationOptions }: FetchOptions<T>) {
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const queryString = buildQueryString(queryParams);
  const fullUrl = `${BANDO_API_URL}${url}${queryString}`;

  if (method === 'GET') {
    const query = useQuery<T>({
      queryKey: [url, queryParams],
      queryFn: () => fetchData<T>(fullUrl, fetchOptions),
      enabled: method === 'GET',  
      ...queryOptions,
    });
    return { ...query };
  } else {
    const mutation = useMutation<T, Error, unknown, unknown>({
      mutationKey: [url],
      mutationFn: () => fetchData<T>(fullUrl, fetchOptions),
      ...mutationOptions,
    });
    return { ...mutation };
  }
}
