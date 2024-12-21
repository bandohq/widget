import { Chain } from "../pages/SelectChainPage/types";
import { useFetch } from "./useFetch";

export const useTokens = (chain: Chain) => {
    const { data: response, isPending } = useFetch({
        url:`tokens/${chain?.key}/`,
        method: 'GET',
        queryOptions: {
            queryKey: ['tokens', chain?.key],
            refetchInterval: 300_000,
            staleTime: 300_000,
            enabled: !!chain,
        },
    });
    return {
        ...response,
        isPending,
    };
};