import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List, ListItemText, Chip, Typography } from "@mui/material";
import { SettingsListItemButton } from "../SettingsListItemButton";
import { useTheme } from "@mui/system";
import { Transaction } from "../../pages/TransactionHistory/TransactionHistory";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isRefundAvailable } from "../../utils/refunds";
import { ArrowRight } from "@phosphor-icons/react";

interface TransactionListProps {
  transactions: Transaction[];
  refunds?: {
    id: string;
    txStatus: number;
  }[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  refunds = [],
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const renderChipLabel = (transactionId: string, status: string) => {
    const refund = refunds.find((refund) => refund?.id === transactionId);
    return refund?.txStatus === 0 ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowRight size={16} />
        Refund available
      </div>
    ) : refund?.txStatus === 3 ? (
      <div style={{ display: "flex", alignItems: "center" }}>Refunded</div>
    ) : (
      status.toLocaleLowerCase()
    );
  };

  const handleClick = (transaction: Transaction) => {
    const refund = refunds.find((refund) => refund?.id === transaction.id);
    if (refund?.txStatus === 0) {
      navigate(
        `/transaction-detail/${transaction.id}?serviceId=${transaction.serviceId}&tokenUsed=${transaction.tokenUsed}&status=${refund?.txStatus}`
      );
      return;
    }

    navigate(
      `/transaction-detail/${transaction.id}?status=${
        refund ? refund?.txStatus : 1
      }`
    );
  };

  return (
    <>
      <div ref={parentRef}>
        <List
          sx={{
            width: "100%",
            backgroundColor: "inherit",
            borderRadius: "0",
            boxShadow: "none",
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const transaction = transactions[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  position: "absolute",
                  borderBottom: `solid 1px ${theme.palette.grey[300]}`,
                }}
              >
                <SettingsListItemButton
                  key={transaction.id}
                  style={{ height: `${virtualRow.size}px` }}
                  onClick={() => handleClick(transaction)}
                >
                  <ListItemText
                    primary={transaction.brandName}
                    secondary={t("history.buyDetails")}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "end",
                      fontSize: "12px",
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        margin: "0",
                        marginBottom: "2px",
                      }}
                    >
                      {`${parseFloat(transaction.price.fiatValue).toFixed(2)} ${
                        transaction.price.fiatCurrency
                      }`}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        margin: "0",
                        display: "flex",
                        gap: "4px",
                        alignContent: "center",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {formatDate(transaction.created)}
                      <Chip
                        color="default"
                        sx={
                          isRefundAvailable(transaction.id, refunds)
                            ? {
                                backgroundColor: theme.palette.primary.main,
                              }
                            : transaction.status === "COMPLETED" ||
                              transaction.status === "SUCCESS"
                            ? {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.getContrastText(
                                  theme.palette.primary.light
                                ),
                              }
                            : {}
                        }
                        size="small"
                        label={renderChipLabel(
                          transaction.id,
                          transaction.status
                        )}
                      />
                    </Typography>
                  </div>
                </SettingsListItemButton>
              </div>
            );
          })}
        </List>
      </div>
    </>
  );
};
