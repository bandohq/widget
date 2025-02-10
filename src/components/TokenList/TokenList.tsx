import { useAccount } from "@lifi/wallet-management";
import { Box } from "@mui/material";
import { type FC } from "react";
import { useChain } from "../../hooks/useChain.js";
import { useDebouncedWatch } from "../../hooks/useDebouncedWatch";
import { TokenNotFound } from "./TokenNotFound.js";
import { VirtualizedTokenList } from "./VirtualizedTokenList.js";
import type { TokenListProps } from "./types.js";
import { useTokenSelect } from "./useTokenSelect.js";
import { useTokenBalances } from "../../hooks/useTokenBalances.js";

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
  const { chain: selectedChain } = useChain(account?.chainId);

  const { balances, isLoading } = useTokenBalances(
    account?.address ?? "",
    selectedChain ?? undefined
  );

  const handleTokenClick = useTokenSelect(formType, onClick);
  const showCategories = !tokenSearchFilter;

  return (
    <Box ref={parentRef} style={{ height, overflow: "auto" }}>
      {!balances.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        account={account}
        tokens={balances}
        scrollElementRef={parentRef}
        chainId={account?.chainId}
        chain={selectedChain}
        isLoading={isLoading}
        showCategories={showCategories}
        isBalanceLoading
        onClick={handleTokenClick}
      />
    </Box>
  );
};
