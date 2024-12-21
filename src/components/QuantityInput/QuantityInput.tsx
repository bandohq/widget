import { type CardProps } from "@mui/material";
import type { ChangeEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fitInputText } from "../../utils/input";
import { CardTitle } from "../Card/CardTitle.js";
import {
  FormContainer,
  maxInputFontSize,
  minInputFontSize,
  FormButton,
  InputCard,
} from "./Quantity.style.js";
import { useFieldController } from "../../stores/form/useFieldController.js";

export const QuantityInput: React.FC<
  CardProps & {
    disabled?: boolean;
    marginTop?: string | number;
  }
> = ({ disabled, marginTop, ...props }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, value } = useFieldController({ name: "quantity" });

  const handleClick = (type: "up" | "down") => {
    if (value === 1 && type === "down") return;
    const newValue = type === "up" ? value + 1 : value - 1;
    onChange(newValue);
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [value]);

  return (
    <InputCard {...props} style={{ marginTop }}>
      {/* todo: add i18n */}
      <CardTitle>quantity</CardTitle>
      <FormContainer>
        <FormButton size="small" onClick={() => handleClick("down")}>
          -
        </FormButton>
        {value}
        <FormButton size="small" onClick={() => handleClick("up")}>
          +
        </FormButton>
      </FormContainer>
    </InputCard>
  );
};
