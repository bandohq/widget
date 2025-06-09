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
import { useAccount } from "@lifi/wallet-management";
import { useUserWallet } from "../../providers/UserWalletProvider/UserWalletProvider";
import { useTransactionHelpers } from "../../hooks/useTransactionHelpers";

interface ReviewButtonProps {
  referenceType: ReferenceType;
  requiredFields: ReferenceType[];
}

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  referenceType,
  requiredFields: requiredFieldsProps,
}) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { showNotification, hideNotification } = useNotificationContext();
  const { isPending } = useTransactionFlow();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const { isPurchasePossible } = useQuotes();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { handleTransaction } = useTransactionFlow();
  const { loading: transactionLoading } = useTransactionHelpers();
  const [tokenAddress, reference, requiredFields] = useFieldValues(
    tokenKey,
    "reference",
    "requiredFields"
  );

  const { chain: selectedChain } = useChain(account?.chainId);

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
      !selectedChain?.isActive ||
      !userAcceptedTermsAndConditions
    );
  }, [
    tokenAddress,
    reference,
    referenceType,
    requiredFields,
    userAcceptedTermsAndConditions,
    isPurchasePossible,
    requiredFieldsProps,
    selectedChain?.isActive,
  ]);

  useEffect(() => {
    if (account?.isConnected && !selectedChain?.isActive) {
      showNotification("error", t("error.message.unavailableChain"), true);
    } else {
      hideNotification();
    }
  }, [disabled, t, selectedChain?.isActive]);

  return (
    <BaseTransactionButton
      disabled={disabled || isPending || !tokenAddress}
      text={t("header.spend")}
      onClick={() => handleTransaction()}
      loading={transactionLoading}
    />
  );
};
