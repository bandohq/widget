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
import { ReferenceType } from "../../providers/CatalogProvider/types.js";

interface ReferenceInputProps extends FormTypeProps, CardProps {
  disabled?: boolean;
  index: number;
  referenceType: ReferenceType;
}

export const Input: React.FC<ReferenceInputProps> = ({
  formType,
  index,
  disabled,
  referenceType,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, onBlur, value } = useFieldController({ name: "reference" });
  const { country } = useCountryContext();

  const [error, setError] = useState<string | null>(null);

  const currentValue =
    Array.isArray(value) && value[index]?.value ? value[index].value : "";

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    if (referenceType.regex && !referenceType.regex.test(newValue)) {
      setError(`Invalid ${referenceType.name} format.`);
    } else {
      setError(null);
    }

    const updatedReferences = Array.isArray(value) ? [...value] : [];
    updatedReferences[index] = {
      key: referenceType.name,
      value: newValue,
    };
    onChange(updatedReferences);
  };

  const handleBlur = () => {
    if (
      currentValue &&
      referenceType.regex &&
      !referenceType.regex.test(currentValue)
    ) {
      setError(`Invalid ${referenceType.name} format.`);
    } else {
      setError(null);
    }

    onBlur();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [currentValue]);

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
                  value={currentValue}
                  onChange={(newPhoneValue) => {
                    const updatedReferences = Array.isArray(value)
                      ? [...value]
                      : [];
                    updatedReferences[index] = {
                      ...referenceType,
                      value: newPhoneValue || "",
                    };
                    onChange(updatedReferences);
                  }}
                />
              </StyledPhoneInput>
            ) : (
              <StyledInput
                inputRef={ref}
                size="small"
                type="text"
                autoComplete="off"
                placeholder={`Enter your ${title}`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={currentValue}
                name={`reference-${index}`}
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
