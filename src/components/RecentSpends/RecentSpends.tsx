import { Typography } from "@mui/material";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import HorizontalSlider from "./HorizontalSlider";
import { useFetch } from "../../hooks/useFetch";
import { useAccount } from "@lifi/wallet-management";

export const RecentSpends = () => {
  const { account } = useAccount();
  const {
    data: transactions,
    isPending,
    error,
  } = useFetch({
    url: account.address ? `wallets/${account.address}/transactions` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transactions", account.address, account.chainId],
    },
    queryParams: {
      chainId: account.chainId,
    },
  });

  const uniqueBrandTransactions = transactions?.transactions
    ? Array.from(
        new Map(
          transactions.transactions.map((tx) => [tx.brandName, tx])
        ).values()
      )
    : [];
  console.log(uniqueBrandTransactions);
  if (!account.address || !uniqueBrandTransactions.length) return null;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography variant="body2">
          <ClockCounterClockwise /> Recent Spends
        </Typography>
      </div>
      <HorizontalSlider items={uniqueBrandTransactions} />
    </div>
  );
};
