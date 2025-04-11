import React, { useState } from "react";
import { Box, Chip, Skeleton } from "@mui/material";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";
import { VariantSelector } from "../VariantSelector/VariantSelector";
import { Adress } from "../../pages/SelectChainPage/types";

export interface Transaction {
  id: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | string;
  price: {
    fiatCurrency: string;
    fiatValue: string;
    stableCoinCurrency: string;
    stableCoinValue: string;
  };
  productType: string;
  productSku: string;
  quantity: string;
  chainId: number;
  tokenUsed: string;
  tokenAmountPaid: number;
  imageUrl: string;
  created: string;
  brandName: string;
  walletAddress: Adress;
  blockchainTransactionHash: string | null;
  serviceId: number;
  recordId: number;
}

export const HorizontalSlider = ({
  items,
  isPending,
}: {
  items: Transaction[];
  isPending: boolean;
}) => {
  const { products } = useCatalogContext();
  const { updateBrand, updateProduct, brand } = useProduct();
  const [open, setOpen] = useState(false);

  const handleChipClick = (item) => {
    const productType = item.productType;

    const productArray = products.find(
      (p) => p.productType === productType
    ).brands;

    if (!productArray) return;

    const brand = productArray.find((p) => p.brandName === item.brandName);
    if (brand) {
      updateBrand(brand);
      setOpen(true);
      updateProduct(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1,
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        {isPending
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={"200px"}
                height={32}
                animation="wave"
              />
            ))
          : items.map((item) => (
              <Chip
                key={item.brandName}
                color="default"
                onClick={() => handleChipClick(item)}
                size="small"
                label={item.brandName}
              />
            ))}
      </Box>
      <VariantSelector
        open={open}
        onClose={() => setOpen(false)}
        selectedBrand={brand}
        onVariantSelect={(item) => {
          setOpen(false);
        }}
      />
    </>
  );
};
