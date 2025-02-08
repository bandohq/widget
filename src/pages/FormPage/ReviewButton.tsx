import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTransactionButton } from "../../components/BaseTransactionButton/BaseTransactionButton";
import { useTransactionFlow } from "../../hooks/useTransactionFlow";
import { useFieldValues } from "../../stores/form/useFieldValues";
import { FormKeyHelper } from "../../stores/form/types";
import { ReferenceType } from "../../providers/CatalogProvider/types";
import { useQuotes } from "../../providers/QuotesProvider/QuotesProvider";
import { useChain } from "../../hooks/useChain";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";
import {
  areRequiredFieldsValid,
  isReferenceValid,
} from "../../utils/reviewValidations";

interface ReviewButtonProps {
  referenceType: ReferenceType;
  requiredFields: ReferenceType[];
}

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  referenceType,
  requiredFields: requiredFieldsProps,
}) => {
  const { t } = useTranslation();
  const { showNotification, hideNotification } = useNotificationContext();
  const { handleTransaction, isPending } = useTransactionFlow();
  const { isPurchasePossible } = useQuotes();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress, reference, requiredFields, selectedChainId] =
    useFieldValues(
      tokenKey,
      "reference",
      "requiredFields",
      FormKeyHelper.getChainKey("from")
    );

  const { chain: selectedChain } = useChain(selectedChainId);

  const disabled = useMemo(() => {
    const referenceValid = isReferenceValid(reference, referenceType);
    const requiredFieldsValid = areRequiredFieldsValid(
      requiredFields,
      requiredFieldsProps
    );
    return (
      !referenceValid ||
      !requiredFieldsValid ||
      !isPurchasePossible ||
      !selectedChain?.is_active
    );
  }, [tokenAddress, reference, referenceType, requiredFields]);

  useEffect(() => {
    if (!selectedChain?.is_active) {
      showNotification("error", t("error.message.unavailableChain"), true);
    } else {
      hideNotification();
    }
  }, [disabled, t, selectedChain?.is_active]);

  return (
    <BaseTransactionButton
      disabled={disabled || isPending || !tokenAddress}
      text={t("header.spend")}
      onClick={handleTransaction}
      loading={isPending}
    />
  );
};
