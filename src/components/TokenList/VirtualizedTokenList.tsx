import { List, Typography } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { FC } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TokenListItem, TokenListItemSkeleton } from "./TokenListItem.js";
import type { VirtualizedTokenListProps } from "./types.js";
import { TokenAmount } from "../../pages/SelectTokenPage/types.js";

export const VirtualizedTokenList: FC<VirtualizedTokenListProps> = ({
  account,
  tokens,
  scrollElementRef,
  chainId,
  chain,
  isLoading,
  showCategories,
  onClick,
}) => {
  const { t } = useTranslation();

  const { getVirtualItems, getTotalSize, scrollToIndex } = useVirtualizer({
    count: tokens.length,
    overscan: 10,
    paddingEnd: 12,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: (index) => {
      // Base size for TokenListItem
      let size = 64;
      // Early return if categories are not shown
      if (!showCategories) {
        return size;
      }

      const currentToken = tokens[index];
      const previousToken = tokens[index - 1];

      // Adjust size based on changes between the current and previous tokens
      const isCategoryChanged = previousToken?.amount && !currentToken.amount;

      if (isCategoryChanged) {
        size += 32;
      }

      return size;
    },
    getItemKey: (index) => `${tokens[index].address}-${index}`,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    // Scroll to the top of the list when switching the chains
    if (getVirtualItems().length) {
      scrollToIndex(0, { align: "start" });
    }
  }, [scrollToIndex, chainId, getVirtualItems]);

  if (isLoading) {
    return (
      <List disablePadding>
        {Array.from({ length: 3 }).map((_, index) => (
          <TokenListItemSkeleton key={index} />
        ))}
      </List>
    );
  }

  return (
    <List style={{ height: getTotalSize() }} disablePadding>
      {getVirtualItems().map((item) => {
        const currentToken = tokens[item.index];
        const previousToken: TokenAmount | undefined = tokens[item.index - 1];

        const isTransitionFromMyTokens =
          previousToken?.amount && !currentToken.amount;

        const shouldShowAllTokensCategory = isTransitionFromMyTokens;

        const startAdornmentLabel = showCategories
          ? (() => {
              if (shouldShowAllTokensCategory) {
                return t("main.allTokens");
              }
              return null;
            })()
          : null;

        return (
          <TokenListItem
            key={item.key}
            onClick={onClick}
            size={item.size}
            start={item.start}
            token={currentToken}
            chain={chain}
            accountAddress={account.address}
            startAdornment={
              startAdornmentLabel ? (
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  lineHeight="16px"
                  px={1.5}
                  pb={1}
                >
                  {startAdornmentLabel}
                </Typography>
              ) : null
            }
          />
        );
      })}
    </List>
  );
};
