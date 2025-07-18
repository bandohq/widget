import { useAccount } from "@lifi/wallet-management";
import { Box } from "@mui/material";
import { type FC, useMemo } from "react";
import { useChain } from "../../hooks/useChain.js";
import { useDebouncedWatch } from "../../hooks/useDebouncedWatch";
import { TokenNotFound } from "./TokenNotFound.js";
import { VirtualizedTokenList } from "./VirtualizedTokenList.js";
import type { TokenListProps } from "./types.js";
import { useTokenSelect } from "./useTokenSelect.js";
import { useTokenBalances } from "../../hooks/useTokenBalances.js";
import { useTokens } from "../../hooks/useTokens.js";
import { useWorld } from "../../hooks/useWorld.js";

export const TokenList: FC<TokenListProps> = ({
  formType,
  parentRef,
  height,
  onClick,
}) => {
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    320,
    "tokenSearchFilter"
  );

  const { account } = useAccount();
  const { isWorld, provider } = useWorld();
  const { chain: selectedChain } = useChain(account?.chainId);

  const { isPending: tokensLoading, isError } = useTokens(selectedChain);

  const {
    balances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useTokenBalances(
    isWorld ? provider?.user?.walletAddress : account?.address ?? "",
    selectedChain ?? undefined
  );

  const filteredTokens = useMemo(() => {
    if (!tokenSearchFilter) return balances;

    const searchTerm = tokenSearchFilter.toLowerCase();
    return balances.filter(
      (token) =>
        token.name?.toLowerCase().includes(searchTerm) ||
        token.symbol?.toLowerCase().includes(searchTerm) ||
        token.address?.toLowerCase().includes(searchTerm)
    );
  }, [balances, tokenSearchFilter]);

  const handleTokenClick = useTokenSelect(formType, onClick);
  const showCategories = !tokenSearchFilter;

  const isLoading =
    isError || balancesError || tokensLoading || balancesLoading;

  return (
    <Box ref={parentRef} style={{ height, overflow: "auto" }}>
      {!filteredTokens.length && !balancesLoading && !tokensLoading && (
        <TokenNotFound formType={formType} />
      )}
      <VirtualizedTokenList
        account={account}
        tokens={filteredTokens}
        scrollElementRef={parentRef}
        chainId={account?.chainId}
        chain={selectedChain}
        isLoading={isLoading}
        showCategories={showCategories}
        isBalanceLoading={balancesLoading}
        onClick={handleTokenClick}
      />
    </Box>
  );
};
