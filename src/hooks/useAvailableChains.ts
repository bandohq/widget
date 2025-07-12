import { useCallback, useEffect } from "react";
import { useFetch } from "./useFetch";
import { ExtendedChain } from "../pages/SelectChainPage/types.js";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";

export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined;

export const useAvailableChains = () => {
  const { showNotification } = useNotificationContext();
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useFetch({
    url: `networks/`,
    method: "GET",
    queryParams: {},
    queryOptions: {
      queryKey: ["available-chains"],
      refetchInterval: 300_000,
      staleTime: 300_000,
      retry: (failureCount, error) => {
        // Retry 3 times for network errors
        if (failureCount < 3) {
          return true;
        }
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });

  const data = response?.data || [];
  useEffect(() => {
    if (error) {
      console.error("Error fetching available chains:", error);
      showNotification("error", "Error fetching available chains");
    }
  }, [error]);

  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return undefined;
      }

      const chain = chains?.find((chain) => chain.chainId === chainId);
      return chains.length > 0 && chain ? chain : chains[0];
    },
    [data]
  );

  return {
    chains: data,
    getChainById,
    isPending,
    isError,
    error,
    isLoading: isPending,
    hasError: isError,
  };
};
