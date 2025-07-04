import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CardProps } from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { onChange, onBlur, value } = useFieldController({
    name: isRequired ? "requiredFields" : "reference",
  });
  const { selectedCountry: country } = useCountryContext();
  const [error, setError] = useState<string | null>(null);
  const currentValue =
    Array.isArray(value) && value[index]?.value ? value[index].value : "";
  const [inputValue, setInputValue] = useState<string>(() => {
    return !isRequired ? "" : currentValue;
  });
  const phoneRegex =
    "^(\\+?\\d{1,3}[-.\\s]?)?(\\(?\\d{3}\\)?[-.\\s]?)?\\d{3}[-.\\s]?\\d{4}$";

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    const regex =
      typeof referenceType.regex === "string"
        ? new RegExp(referenceType.regex)
        : referenceType.regex;

    if (regex && !regex.test(newValue)) {
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

  const handlePhoneChange = (newPhone: string | undefined) => {
    const finalPhone = newPhone || "";
    setInputValue(finalPhone);

    if (!isValidPhoneNumber(finalPhone)) {
      setError(`Invalid ${referenceType.name} format.`);
    } else {
      setError(null);
    }

    if (isRequired) {
      const updatedReferences = Array.isArray(value) ? [...value] : [];
      updatedReferences[index] = {
        key: referenceType.name,
        value: finalPhone,
      };
      onChange(updatedReferences);
    } else {
      onChange(finalPhone);
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
        <CardTitle>
          {t("form.common.your", { field: t(getReferenceTitleByKey(title)) })}
        </CardTitle>

        <FormContainer>
          <FormControl fullWidth>
            {referenceType.regex === phoneRegex ? (
              <StyledPhoneInput>
                <PhoneInput
                  countryCallingCodeEditable={false}
                  placeholder="Enter phone number"
                  // @ts-ignore all iso codes are valid
                  defaultCountry={country?.isoAlpha2}
                  value={inputValue}
                  onChange={handlePhoneChange}
                />
              </StyledPhoneInput>
            ) : (
              <StyledInput
                inputRef={ref}
                type="text"
                autoComplete="off"
                placeholder={t("form.common.enter_your", {
                  field: t(getReferenceTitleByKey(title)),
                })}
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
