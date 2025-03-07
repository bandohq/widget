import React, { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List, ListItemText, Collapse } from "@mui/material";
import { SettingsListItemButton } from "../SettingsListItemButton";
import { useTheme } from "@mui/system";

interface TransactionListProps {
  transactions: {
    id: string;
    status: string;
    productType: string;
    chainId: number;
    brandName: string;
  }[];
  onSelectTransaction?: (transaction) => void;
  isDropdown?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onSelectTransaction,
  isDropdown = true,
}) => {
    const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdownOpen] = useState(isDropdown);

  console.log(transactions);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });


  return (
    <>
      <Collapse in={dropdownOpen}>
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
                    onClick={() =>{}}
                  >
                    <ListItemText primary={transaction.brandName} secondary={'buy detail'} />
                  </SettingsListItemButton>
                </div>
              );
            })}
          </List>
        </div>
      </Collapse>
    </>
  );
};
