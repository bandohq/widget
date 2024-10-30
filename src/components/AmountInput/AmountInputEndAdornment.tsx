import { InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FormTypeProps } from "../../stores/form/types.js";
import { FormKeyHelper } from "../../stores/form/types.js";
import { useFieldActions } from "../../stores/form/useFieldActions.js";
import { MaxButton } from "./AmountInputAdornment.style.js";

export const AmountInputEndAdornment = ({ formType }: FormTypeProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFieldActions();

  const handleMax = () => {
    // Set a fixed or default max amount for the field, e.g., "100" as a placeholder
    setFieldValue(
      FormKeyHelper.getAmountKey(formType),
      "100", // Placeholder value for max amount
      {
        isTouched: true,
      }
    );
  };

  return (
    <InputAdornment position="end">
      {formType === "from" ? (
        <MaxButton onClick={handleMax}>{t("button.max")}</MaxButton>
      ) : null}
    </InputAdornment>
  );
};
