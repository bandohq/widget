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
import { ChangeEvent, useState } from "react";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";

interface Country {
  iso_alpha2: string;
  name: string;
  flag_url: string;
}

interface ProductSearchProps {
  productType?: string;
}

export const ProductSearch = ({
  productType,
}: ProductSearchProps): JSX.Element | null => {
  const {
    selectedCountry: country,
    availableCountries: countries,
    selectCountry,
  } = useCountryContext();
  const { fuzzySearchBrands, filteredBrands } = useCatalogContext();
  const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState("");

  if (!countries.length) {
    return null;
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchKey(event.target.value);
    fuzzySearchBrands(event.target.value, productType);
  };

  const handleCountryChange = (
    event: ChangeEvent<{ value: unknown }>
  ): void => {
    selectCountry(event.target.value as string);
    fuzzySearchBrands(searchKey, productType);
  };

  return (
    <>
      <SearchContainer>
        <InputContainer>
          <StyledInputBase
            placeholder={t("main.searchProducts")}
            onChange={handleSearchChange}
            inputProps={{ "aria-label": "search products" }}
          />
          <StyledIconButton aria-label="search">
            <SearchIcon />
          </StyledIconButton>
        </InputContainer>
        <CountrySelect
          value={country?.iso_alpha2 || ""}
          onChange={(event) =>
            handleCountryChange(event as ChangeEvent<{ value: unknown }>)
          }
          displayEmpty
          inputProps={{ "aria-label": "Country" }}
          renderValue={() =>
            country?.flag_url ? (
              <img src={country.flag_url} alt={country.iso_alpha2} width={20} />
            ) : null
          }
        >
          {countries.map((countryItem: Country) => (
            <MenuItem
              key={countryItem.iso_alpha2}
              value={countryItem.iso_alpha2}
            >
              <Tooltip title={countryItem.name}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={countryItem.flag_url}
                    alt={countryItem.name}
                    width={20}
                    style={{ marginRight: 5 }}
                  />
                  {countryItem.name}
                </div>
              </Tooltip>
            </MenuItem>
          ))}
        </CountrySelect>
      </SearchContainer>
    </>
  );
};
