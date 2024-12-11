import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useTokens } from "./useTokens";
import { ExtendedChain } from "../pages/SelectChainPage/types";

export const useTokenBalances = (accountAddress: string, chain: ExtendedChain) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: tokens, isPending: tokensLoading } = useTokens(chain);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!tokens || !chain || !accountAddress) return;

      setLoading(true);
      setError(null);

      try {
        // Validar el rpc_url
        const rpcUrl = chain.rpc_url;
        if (!rpcUrl || rpcUrl === "TBD") {
          console.error("Invalid RPC URL:", rpcUrl);
          setError("Invalid RPC URL");
          return;
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Promises to get token balances
        const balancePromises = tokens.map(async (token: any) => {
          const { address, decimals } = token;

          if (!address) {
            console.warn(`Token ${token.name} does not have an address.`);
            return null;
          }

          const tokenContract = new ethers.Contract(address, ["function balanceOf(address) view returns (uint256)"], provider);

          // Consultar balance del token
          const balanceRaw = await tokenContract.balanceOf(accountAddress);
          const balance = ethers.formatUnits(balanceRaw, decimals);

          return {
            ...token,
            balance: parseFloat(balance),
          };
        });

        // Only return non-zero balances
        const allBalances = await Promise.all(balancePromises);
        const nonZeroBalances = allBalances.filter((token) => token && token.balance > 0);

        setBalances(nonZeroBalances);
      } catch (err) {
        console.error("Error getting balances:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [tokens, chain, accountAddress]);

  return { balances, loading: loading || tokensLoading, error };
};
