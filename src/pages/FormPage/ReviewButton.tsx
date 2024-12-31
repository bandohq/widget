import React from "react";
import { useTranslation } from "react-i18next";
import { BaseTransactionButton } from "../../components/BaseTransactionButton/BaseTransactionButton";
import { useTransactionFlow } from "../../hooks/useTransactionFlow";

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const { handleTransaction, isPending } = useTransactionFlow();

  return (
    <BaseTransactionButton
      text={t("header.spend")}
      onClick={handleTransaction}
      loading={isPending}
    />
  );
};
