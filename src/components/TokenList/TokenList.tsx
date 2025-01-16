import { useAccount } from "@lifi/wallet-management";
import { Box } from "@mui/material";
import { type FC } from "react";
import { useChain } from "../../hooks/useChain.js";
import { useDebouncedWatch } from "../../hooks/useDebouncedWatch";
import { FormKeyHelper } from "../../stores/form/types.js";
import { useFieldValues } from "../../stores/form/useFieldValues.js";
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
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType));
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    320,
    "tokenSearchFilter"
  );

  const { chain: selectedChain } = useChain(selectedChainId);

  const { account } = useAccount({
    chainType: selectedChain?.network_type,
  });
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
        chainId={selectedChainId}
        chain={selectedChain}
        isLoading={isLoading}
        showCategories={showCategories}
        isBalanceLoading
        onClick={handleTokenClick}
      />
    </Box>
  );
};
