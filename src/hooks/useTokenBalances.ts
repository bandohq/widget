import { useEffect, useState } from "react";
import { getBalance, multicall } from "@wagmi/core";
import { useTokens } from "./useTokens";
import { ExtendedChain } from "../pages/SelectChainPage/types";
import { createDynamicConfig } from "../utils/configWagmi";
import { wagmiContractAbi } from "../utils/abis";
import { useTranslation } from "react-i18next";
import { useWorld } from "./useWorld";

export const useTokenBalances = (
  accountAddress: string,
  chain: ExtendedChain
) => {
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWorld, provider } = useWorld();
  const { t } = useTranslation();

  const {
    data: tokens,
    isPending: tokensLoading,
    isError: tokensError,
  } = useTokens(chain);

  useEffect(() => {
    const fetchBalances = async () => {
      if (tokensError) {
        const errorMessage = t("error.message.tokenLoadFailed");
        setError(errorMessage);
        setLoading(false);
        setBalances([]);
        return;
      }
      if (!tokens || tokensLoading || !chain || !accountAddress) return;

      setLoading(true);
      setError(null);

      try {
        // Create dynamic config for the current chain
        const config = createDynamicConfig(chain);

        const nativeTokenBalance = await getBalance(config, {
          address: accountAddress as `0x${string}`,
        });

        // Build contracts for multicall
        const contracts = tokens.map((token) => ({
          address: token.address,
          abi: wagmiContractAbi.abi,
          functionName: "balanceOf",
          args: [accountAddress as `0x${string}`],
          chainId: chain.id,
        }));

        // Execute multicall
        // @ts-ignore number controlled by whitelist
        const data = await multicall(config, { batchSize: 0, contracts });

        // Format and filter balances
        const formattedBalances = data.map((balanceRaw, index) => {
          const token = tokens[index];
          const decimals = token?.decimals || 18;
          let formattedBalance: number;

          if (chain?.nativeToken?.symbol === tokens[index].symbol) {
            formattedBalance =
              Number(nativeTokenBalance.value) / 10 ** decimals;
          } else {
            formattedBalance = Number(balanceRaw.result) / 10 ** decimals;
          }

          return {
            key: token.key,
            imageUrl: token.imageUrl,
            address: token.address,
            balance: formattedBalance,
            symbol: token.symbol,
            name: token.name,
          };
        });

        const nonZeroBalances = formattedBalances.filter(
          (token) => token.balance > 0
        );

        setBalances(nonZeroBalances);
      } catch (err) {
        const errorMessage = t("error.message.balanceLoadFailed");
        setError(errorMessage);
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [tokens, tokensLoading, accountAddress, chain]);

  return { balances, isLoading: loading, error };
};
