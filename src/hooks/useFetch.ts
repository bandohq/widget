import { useQuery, useMutation, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

// Type for hook configuration options
type FetchOptions<T> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  queryOptions?: UseQueryOptions<T>;       
  mutationOptions?: UseMutationOptions<T, Error, unknown, unknown>; 
};

async function fetchData<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFetch<T = any>({ url, method = 'GET', data, queryOptions, mutationOptions }: FetchOptions<T>) {
  // Setting options for `fetch`
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  // GET requests using useQuery
  const query = useQuery<T>({
    queryKey: [url], 
    queryFn: () => fetchData<T>(url, fetchOptions),
    enabled: method === 'GET',  
    ...queryOptions,
  });

const mutation = useMutation<T, Error, void>({
  mutationKey: [url],
  mutationFn: () => fetchData<T>(url, fetchOptions),
  ...mutationOptions,
});

  return method === 'GET' ? query : mutation;
}
