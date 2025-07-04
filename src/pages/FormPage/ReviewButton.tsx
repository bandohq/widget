import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import { useFlags } from "launchdarkly-react-client-sdk";
import { navigationRoutes } from "../../utils/navigationRoutes";

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
  const navigate = useNavigate();
  const { showNotification, hideNotification } = useNotificationContext();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const { isPurchasePossible, error: quoteError } = useQuotes();
  const { transactionFlow } = useFlags();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { handleTransaction, isPending: transactionLoading } =
    useTransactionFlow();
  const [tokenAddress, reference, requiredFields] = useFieldValues(
    tokenKey,
    "reference",
    "requiredFields"
  );

  const handleClick = () => {
    if (transactionFlow) {
      handleTransaction();
    } else {
      navigate(navigationRoutes.formSteps);
    }
  };

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
      !userAcceptedTermsAndConditions ||
      !!quoteError
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
    quoteError,
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
      disabled={disabled || transactionLoading || !tokenAddress}
      text={t("header.spend")}
      onClick={() => handleClick()}
      loading={transactionLoading}
    />
  );
};
