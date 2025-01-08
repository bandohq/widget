import { useEffect, useState } from "react";
import { useTokens } from "./useTokens";
import { ExtendedChain } from "../pages/SelectChainPage/types";
import { useReadContracts } from "wagmi";

export const wagmiContractAbi = {
  abi: [
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'totalSupply',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: 'supply', type: 'uint256' }],
    },
  ],
} as const;

export const useTokenBalances = (accountAddress: string, chain: ExtendedChain) => {
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokensContracts, setTokensContracts] = useState<any[]>([]);

  const { data: tokens, isPending: tokensLoading } = useTokens(chain);

  useEffect(() => {
    if (tokens) {
      const contracts = tokens.map((token) => ({
        address: token?.address,
        ...wagmiContractAbi,
        functionName: 'balanceOf',
        args: [accountAddress as `0x${string}`],
        chainId: chain.id,
      }));
      setTokensContracts(contracts);
    }
  }, [tokens, accountAddress, chain]);

  // Execute multicall
  const { data, isError, isLoading, error: readError } = useReadContracts({
    contracts: tokensContracts,
  });

  console.log("data", data);

  // Process the results and update the balances
  useEffect(() => {
    if (isError) {
      setError(readError?.message || "Error reading token balances");
      setBalances([]);
    } else if (data && tokens) {
      const formattedBalances = data.map((balanceRaw, index) => {
        const token = tokens[index]; 
        const decimals = token?.decimals || 18;
        const formattedBalance = Number(balanceRaw) / 10 ** decimals;

        return {
          key: token.key,
          address: token.address,
          balance: formattedBalance,
          symbol: token.symbol,
        };
      });

      const nonZeroBalances = formattedBalances.filter((token) => token.balance > 0);

      setBalances(nonZeroBalances);
    }

    console.log("balances", balances);

    setLoading(isLoading || tokensLoading);
  }, [data, isError, readError, isLoading, tokens, tokensLoading]);

  return { balances, loading, error };
};
