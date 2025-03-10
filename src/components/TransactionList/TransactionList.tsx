import React, { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List, ListItemText, Collapse, Chip } from "@mui/material";
import { SettingsListItemButton } from "../SettingsListItemButton";
import { useTheme } from "@mui/system";
import { Transaction } from "../../pages/TransactionHistory/TransactionHistory";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const renderChipColor = (status) => {
    switch (status) {
      case "COMPLETED":
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const handleClick = (transaction) => {
    navigate(`/transaction-detail?serviceId=${transaction.serviceId}`);
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
                    primary={"transaction.brandName"}
                    secondary={"buy detail"}
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
                    <div
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        marginBottom: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {`${parseFloat(transaction.price.fiatValue).toFixed(2)} ${
                        transaction.price.fiatCurrency
                      }`}
                    </div>
                    <div
                      style={{
                        margin: "0",
                        display: "flex",
                        gap: "4px",
                        alignContent: "center",
                      }}
                    >
                      {formatDate(transaction.created)}
                      <Chip
                        color={renderChipColor(transaction.status)}
                        size="small"
                        label={transaction.status.toLocaleLowerCase()}
                      />
                    </div>
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
