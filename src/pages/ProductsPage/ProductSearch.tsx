import { MenuItem } from "@mui/material";
import {
  CountrySelect,
  InputContainer,
  SearchContainer,
  StyledIconButton,
  StyledInputBase,
} from "./ProductPage.style";
import SearchIcon from "@mui/icons-material/Search";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";

export const ProductSearch = ({}) => {
  const { country, countries, selectCountry } = useCountryContext();

  if (!countries.length) {
    return null;
  }

  return (
    <SearchContainer>
      <InputContainer>
        <StyledInputBase placeholder="Search for anything" />
        <StyledIconButton>
          <SearchIcon />
        </StyledIconButton>
      </InputContainer>
      <CountrySelect
        value={country.iso_alpha2}
        onChange={(e) => selectCountry(e.target.value as string)}
        displayEmpty
        inputProps={{ "aria-label": "Country" }}
      >
        {countries.map((country) => (
          <MenuItem key={country.iso_alpha2} value={country.iso_alpha2}>
            <img src={country.flag_url} alt={country.name} width={20} />
          </MenuItem>
        ))}
      </CountrySelect>
    </SearchContainer>
  );
};
