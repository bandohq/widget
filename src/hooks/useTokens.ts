import { Chain } from "../pages/SelectChainPage/types";
import { useFetch } from "./useFetch";

export const useTokens = (chain: Chain) => {
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useFetch({
    url: `token/${chain?.key}/`,
    method: "GET",
    queryOptions: {
      queryKey: ["tokens", chain?.chainId],
      refetchInterval: 300_000,
      staleTime: 300_000,
      enabled: !!chain,
    },
  });

  return {
    ...response,
    isPending,
    isError,
    error,
  };
};
