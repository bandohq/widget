import { Typography } from "@mui/material";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { HorizontalSlider, Transaction } from "./HorizontalSlider";
import { useFetch } from "../../hooks/useFetch";
import { useAccount } from "@lifi/wallet-management";
import { useWorld } from "../../hooks/useWorld.js";

export const RecentSpends = () => {
  const { account } = useAccount();
  const { isWorld, provider } = useWorld();

  const userAddress = isWorld
    ? provider?.user?.walletAddress
    : account?.address;
  const chainId = isWorld ? 480 : account?.chainId;

  const {
    data: transactions,
    isPending,
    error,
  } = useFetch<{ transactions: Transaction[] }>({
    url: userAddress ? `wallets/${userAddress}/transactions` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transactions", userAddress, chainId],
      enabled: !!userAddress && !!chainId,
    },
    queryParams: {
      chainId,
    },
  });

  const uniqueBrandTransactions = transactions?.transactions
    ? Array.from(
        new Map(
          transactions.transactions.map((tx) => [tx.brandName, tx])
        ).values()
      )
    : [];
  if (!userAddress || !uniqueBrandTransactions.length || error) return null;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography variant="body2">
          <ClockCounterClockwise /> Recent Spends
        </Typography>
      </div>
      <HorizontalSlider items={uniqueBrandTransactions} isPending={isPending} />
    </div>
  );
};
