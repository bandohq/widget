import React from "react";
import { useTranslation } from "react-i18next";
import { BaseTransactionButton } from "../../components/BaseTransactionButton/BaseTransactionButton";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useTransactionFlow } from "../../hooks/useTransactionFlow";

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const { product } = useProduct();
  const { handleTransaction, isPending } = useTransactionFlow(product);

  return (
    <BaseTransactionButton
      text={t("header.spend")}
      onClick={handleTransaction}
      loading={isPending}
    />
  );
};
