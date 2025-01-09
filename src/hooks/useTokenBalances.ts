import { useEffect, useState } from "react";
import { multicall } from "@wagmi/core";
import { useTokens } from "./useTokens";
import { ExtendedChain } from "../pages/SelectChainPage/types";
import { createDynamicConfig } from "../utils/configWagmi";
import { wagmiContractAbi } from "../utils/abis";

export const useTokenBalances = (accountAddress: string, chain: ExtendedChain) => {
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: tokens, isPending: tokensLoading } = useTokens(chain);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!tokens || tokensLoading || !chain || !accountAddress) return;

      setLoading(true);
      setError(null);

      try {
        // Create dynamic config for the current chain
        const config = createDynamicConfig(chain);

        // Build contracts for multicall
        const contracts = tokens.map((token) => ({
          address: token.address,
          abi: wagmiContractAbi.abi,
          functionName: "balanceOf",
          args: [accountAddress as `0x${string}`],
          chainId: chain.id,
        }));

        // Execute multicall
        const data = await multicall(config, { contracts });

        // Format and filter balances
        const formattedBalances = data.map((balanceRaw, index) => {
          const token = tokens[index];
          const decimals = token?.decimals || 18;
          const formattedBalance = Number(balanceRaw.result) / 10 ** decimals;

          return {
            key: token.key,
            image_url: token.image_url,
            address: token.address,
            balance: formattedBalance,
            symbol: token.symbol,
          };
        });

        const nonZeroBalances = formattedBalances.filter((token) => token.balance > 0);

        setBalances(nonZeroBalances);
      } catch (err) {
        console.error("Error fetching balances:", err);
        setError("Error fetching token balances");
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [tokens, tokensLoading, accountAddress, chain]);

  return { balances, loading, error };
};
