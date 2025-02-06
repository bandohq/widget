import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTransactionButton } from "../../components/BaseTransactionButton/BaseTransactionButton";
import { useTransactionFlow } from "../../hooks/useTransactionFlow";
import { useFieldValues } from "../../stores/form/useFieldValues";
import { FormKeyHelper } from "../../stores/form/types";
import { ReferenceType } from "../../providers/CatalogProvider/types";

interface ReviewButtonProps {
  referenceType: ReferenceType;
  requiredFields: ReferenceType[];
}

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  referenceType,
  requiredFields: requiredFieldsProps,
}) => {
  const { t } = useTranslation();
  const { handleTransaction, isPending } = useTransactionFlow();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress, reference, requiredFields] = useFieldValues(
    tokenKey,
    "reference",
    "requiredFields"
  );

  // Validate reference accordint to type
  const isReferenceValid = (ref: string, type: ReferenceType) => {
    if (!ref) return false;

    const regex =
      typeof type.regex === "string" ? new RegExp(type.regex) : type.regex;

    if (regex && !regex.test(ref)) return false;
    return true;
  };

  const areRequiredFieldsValid = (ref: any, fields: ReferenceType[]) => {
    if (!ref || !fields || !Array.isArray(fields)) return false;

    return fields.every((field, index) => {
      const value = Array.isArray(ref) ? ref[index]?.value : ref;
      return isReferenceValid(value, field);
    });
  };

  const disabled = useMemo(() => {
    const referenceValid = isReferenceValid(reference, referenceType);
    const requiredFieldsValid = areRequiredFieldsValid(
      requiredFields,
      requiredFieldsProps
    );
    return !referenceValid || !requiredFieldsValid;
  }, [tokenAddress, reference, referenceType, requiredFields]);

  return (
    <BaseTransactionButton
      disabled={disabled || isPending || !tokenAddress}
      text={t("header.spend")}
      onClick={handleTransaction}
      loading={isPending}
    />
  );
};
