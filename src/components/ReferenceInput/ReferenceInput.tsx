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
import { getReferenceTitleByKey } from "../../utils/getReferenceTitleByKey.js";

interface ReferenceInputProps extends FormTypeProps, CardProps {
  disabled?: boolean;
  index?: number;
  referenceType: ReferenceType;
  isRequired?: boolean;
}

export const Input: React.FC<ReferenceInputProps> = ({
  formType,
  index,
  disabled,
  referenceType,
  isRequired,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, onBlur, value } = useFieldController({
    name: isRequired ? "requiredFields" : "reference",
  });
  const { selectedCountry: country } = useCountryContext();

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

    if (isRequired) {
      const updatedReferences = Array.isArray(value) ? [...value] : [];
      updatedReferences[index] = {
        key: referenceType.name,
        value: newValue,
      };
      onChange(updatedReferences);
    } else {
      onChange(newValue);
    }
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
        <CardTitle>Your {getReferenceTitleByKey(title)}</CardTitle>
        <FormContainer>
          <FormControl fullWidth>
            {referenceType.name === "phone" ? (
              <StyledPhoneInput>
                <PhoneInput
                  countryCallingCodeEditable={false}
                  placeholder="Enter phone number"
                  defaultCountry={country?.iso_alpha2}
                  value={isRequired ? currentValue : value}
                  onChange={(newPhone) => {
                    if (isRequired) {
                      const updatedReferences = Array.isArray(value)
                        ? [...value]
                        : [];
                      updatedReferences[index] = {
                        key: referenceType.name,
                        value: newPhone,
                      };
                      onChange(updatedReferences);
                    } else {
                      onChange(newPhone);
                    }
                  }}
                />
              </StyledPhoneInput>
            ) : (
              <StyledInput
                inputRef={ref}
                size="small"
                type="text"
                autoComplete="off"
                placeholder={`Enter your ${getReferenceTitleByKey(title)}`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={isRequired ? currentValue : value}
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
