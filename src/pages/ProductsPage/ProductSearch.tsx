import { MenuItem, Tooltip } from "@mui/material";
import {
  CountrySelect,
  InputContainer,
  SearchContainer,
  StyledIconButton,
  StyledInputBase,
} from "./ProductPage.style";
import SearchIcon from "@mui/icons-material/Search";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useTranslation } from "react-i18next";

export const ProductSearch = ({ onSearchChange }) => {
  const { country, countries, selectCountry } = useCountryContext();
  const { t } = useTranslation();

  if (!countries.length) {
    return null;
  }

  return (
    <SearchContainer>
      <InputContainer>
        <StyledInputBase
          placeholder={t("main.searchProducts")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <StyledIconButton>
          <SearchIcon />
        </StyledIconButton>
      </InputContainer>
      <CountrySelect
        value={country.iso_alpha2}
        onChange={(e) => selectCountry(e.target.value as string)}
        displayEmpty
        inputProps={{ "aria-label": "Country" }}
        renderValue={() => (
          <img src={country?.flag_url} alt={country?.name} width={20} />
        )}
      >
        {countries.map((country) => (
          <MenuItem key={country.iso_alpha2} value={country.iso_alpha2}>
            <Tooltip title={country.iso_alpha2}>
              <>
                <img
                  src={country.flag_url}
                  alt={country.name}
                  width={20}
                  style={{ marginRight: 5 }}
                />
                {country.name}
              </>
            </Tooltip>
          </MenuItem>
        ))}
      </CountrySelect>
    </SearchContainer>
  );
};
