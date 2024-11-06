import type { CardProps } from "@mui/material";
import type { ChangeEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FormKeyHelper, type FormTypeProps } from "../../stores/form/types.js";
import { DisabledUI, Token } from "../../types/widget.js";
import { formatInputAmount } from "../../utils/format";
import { fitInputText } from "../../utils/input";
import { CardTitle } from "../Card/CardTitle.js";
import { InputCard } from "../Card/InputCard.js";
import {
  FormContainer,
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from "./AmountInput.style";
import { AmountInputEndAdornment } from "./AmountInputEndAdornment";
import { AmountInputStartAdornment } from "./AmountInputStartAdornment";
import { PriceFormHelperText } from "./PriceFormHelperText";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";

// useToken: replace with actual token-fetching logic
const useToken = (chainId?: number, tokenAddress?: string) => ({
  token:
    chainId && tokenAddress
      ? {
          logoURI: "",
          symbol: "MCK",
          decimals: 18,
          name: "MockToken",
          chainId,
          address: tokenAddress,
        }
      : undefined,
});

// useFieldValues: replace with actual field values logic
const useFieldValues = (...args: any[]) => [1, "0xMockAddress"]; // Mocked chain ID and token address

// useFieldController: replace with actual form control logic
const useFieldController = ({ name }: { name: string }) => ({
  onChange: (value: string) => {},
  onBlur: () => {},
  value: "",
});
export const AmountInput: React.FC<FormTypeProps & CardProps> = ({
  formType,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig();

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  );

  const { token } = useToken(chainId as number, tokenAddress as string);
  const disabled = disabledUI?.includes(DisabledUI.FromAmount);
  return (
    <AmountInputBase
      formType={formType}
      token={token}
      endAdornment={
        !disabled ? <AmountInputEndAdornment formType={formType} /> : undefined
      }
      bottomAdornment={<PriceFormHelperText formType={formType} />}
      disabled={disabled}
      {...props}
    />
  );
};

export const AmountInputBase: React.FC<
  FormTypeProps &
    CardProps & {
      token?: Token;
      startAdornment?: ReactNode;
      endAdornment?: ReactNode;
      bottomAdornment?: ReactNode;
      disabled?: boolean;
    }
> = ({
  formType,
  token,
  startAdornment,
  endAdornment,
  bottomAdornment,
  disabled,
  ...props
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const amountKey = FormKeyHelper.getAmountKey(formType);
  const { onChange, onBlur, value } = useFieldController({ name: amountKey });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, token?.decimals, true);
    onChange(formattedAmount);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, token?.decimals);
    onChange(formattedAmount);
    onBlur();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [value]);

  return (
    <InputCard {...props}>
      <CardTitle>{t("header.send")}</CardTitle>
      <FormContainer>
        <AmountInputStartAdornment formType={formType} />
        <FormControl fullWidth>
          <Input
            inputRef={ref}
            size="small"
            autoComplete="off"
            placeholder="0"
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            inputProps={{
              inputMode: "decimal",
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            name={amountKey}
            disabled={disabled}
            required
          />
          {bottomAdornment}
        </FormControl>
      </FormContainer>
    </InputCard>
  );
};
