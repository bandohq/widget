import { Typography, type CardProps } from "@mui/material";
import type { ChangeEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type FormTypeProps } from "../../stores/form/types.js";
import { fitInputText } from "../../utils/input.js";
import { CardTitle } from "../Card/CardTitle.js";
import {
  FormContainer,
  FormControl,
  InputCard,
  StyledInput,
  maxInputFontSize,
  minInputFontSize,
} from "./PhoneInput.style.js";

import { useFieldController } from "../../stores/form/useFieldController.js";
import { CountrySelect } from "../CountrySelect/CountrySelect.js";
import { Country } from "../../stores/CountriesProvider/types.js";

interface PhoneInput extends FormTypeProps, CardProps {
  disabled?: boolean;
  marginTop?: string | number;
}

export const PhoneInput: React.FC<PhoneInput> = ({ disabled, ...props }) => {
  const [countryCode, setCountryCode] = useState<string>("");
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const { onChange, onBlur, value } = useFieldController({ name: "phone" });

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

  const getCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry?.calling_code);
  };

  return (
    <InputCard {...props}>
      {/* //add i18n */}
      <CardTitle>Your phone</CardTitle>
      <FormContainer>
        <FormControl fullWidth>
          <CountrySelect countryGetter={getCountry} />{" "}
          <Typography variant="body1">{`${countryCode} |`}</Typography>
          <StyledInput
            inputRef={ref}
            size="small"
            autoComplete="off"
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
