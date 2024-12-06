import type { CardProps } from "@mui/material";
import type { ChangeEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FormKeyHelper, type FormTypeProps } from "../../stores/form/types.js";
import { formatInputAmount } from "../../utils/format.js";
import { fitInputText } from "../../utils/input.js";
import { CardTitle } from "../Card/CardTitle.js";
import { InputCard } from "../Card/InputCard.js";
import {
  FormContainer,
  FormControl,
  StyledInput,
  maxInputFontSize,
  minInputFontSize,
} from "./Input.style.js";

import { useFieldController } from "../../stores/form/useFieldController.js";

interface ReferenceInputProps extends FormTypeProps, CardProps {
  disabled?: boolean;
  referenceType: string;
}

export const Input: React.FC<ReferenceInputProps> = ({
  formType,
  disabled,
  referenceType = "email",
  ...props
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, onBlur, value } = useFieldController({ name: "reference" });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    onChange(value);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    onChange(value);
    onBlur();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [value]);

  //   const title = t(`reference.title.${formType}`);
  const title = referenceType === "email" ? "email" : "phone number";

  return (
    <InputCard {...props}>
      {/* //add i18n */}
      <CardTitle>Your {title}</CardTitle>
      <FormContainer>
        <FormControl fullWidth>
          <StyledInput
            inputRef={ref}
            size="small"
            autoComplete="off"
            placeholder={`Enter your ${title}`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            name={"reference"}
            disabled={disabled}
            required
          />
        </FormControl>
      </FormContainer>
    </InputCard>
  );
};
