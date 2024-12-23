import React, { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import type { CardProps } from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import type { FormTypeProps } from "../../stores/form/types.js";
import { fitInputText } from "../../utils/input.js";
import { CardTitle } from "../Card/CardTitle.js";
import {
  FormContainer,
  FormControl,
  InputCard,
  StyledInput,
  StyledPhoneInput,
  maxInputFontSize,
  minInputFontSize,
} from "./ReferenceInput.style.js";
import { useFieldController } from "../../stores/form/useFieldController.js";
import { Typography } from "@mui/material";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider.js";

interface ReferenceInputProps extends FormTypeProps, CardProps {
  disabled?: boolean;
  referenceType: {
    name: "email" | "phone";
    regexp?: RegExp; // El regex puede ser undefined
    valueType: "string" | "number";
  };
}

export const Input: React.FC<ReferenceInputProps> = ({
  formType,
  disabled,
  referenceType,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, onBlur, value } = useFieldController({ name: "reference" });
  const { country } = useCountryContext();

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;

    if (referenceType.regexp && !referenceType.regexp.test(value)) {
      setError(`Invalid ${referenceType.name} format.`);
    } else {
      setError(null);
    }

    onChange(value);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;

    if (value && referenceType.regexp && !referenceType.regexp.test(value)) {
      setError(`Invalid ${referenceType.name} format.`);
    } else {
      setError(null);
    }

    onChange(value);
    onBlur();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [value]);

  const title = referenceType.name;

  return (
    <>
      <InputCard {...props} className={error ? "error" : ""}>
        <CardTitle>Your {title}</CardTitle>
        <FormContainer>
          <FormControl fullWidth>
            {referenceType.name === "phone" ? (
              <StyledPhoneInput>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  placeholder="Enter phone number"
                  defaultCountry={country?.iso_alpha2}
                  value={value}
                  onChange={onChange}
                />
              </StyledPhoneInput>
            ) : (
              <StyledInput
                inputRef={ref}
                size="small"
                type={"text"}
                autoComplete="off"
                placeholder={`Enter your ${title}`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
                name={"reference"}
                disabled={disabled}
                required
              />
            )}
          </FormControl>
        </FormContainer>
      </InputCard>
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </>
  );
};
