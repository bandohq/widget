import { BANDO_API_URL_V2 } from "../config/constants";
import { Chain } from "../pages/SelectChainPage/types";
import { useFetch } from "./useFetch";

export const useTokens = (chain: Chain) => {
    const { data: response, isPending } = useFetch({
        url:`${BANDO_API_URL_V2}ramps/token/${chain?.key}/`,
        method: 'GET',
        useFullUrl: false,
        queryOptions: {
            queryKey: ['tokens', chain?.key],
            refetchInterval: 300_000,
            staleTime: 300_000,
            enabled: !!chain,
        },
        queryParams: {
            all: 'true',
            direction: 'OFF',
        },
    });

    return {
        ...response,
        isPending,
    };
};