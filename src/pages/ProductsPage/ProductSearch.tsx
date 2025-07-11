import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  InputContainer,
  SearchContainer,
  StyledCountryDiv,
  StyledIconButton,
  StyledInputBase,
} from "./ProductPage.style";
import SearchIcon from "@mui/icons-material/Search";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { CaretDown } from "@phosphor-icons/react";
import { useTheme } from "@mui/system";

interface ProductSearchProps {
  productType?: string;
  disabled?: boolean;
}

export const ProductSearch = ({
  productType,
  disabled,
}: ProductSearchProps): JSX.Element | null => {
  const theme = useTheme();
  const { selectedCountry: country, availableCountries: countries } =
    useCountryContext();
  const { fuzzySearchBrands } = useCatalogContext();
  const { t } = useTranslation();
  const [, setSearchKey] = useState("");
  const navigate = useNavigate();

  if (!countries.length) {
    return null;
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchKey(event.target.value);
    fuzzySearchBrands(event.target.value, productType);
  };

  const handleCountryRedirect = (): void => {
    const countryQuery = country?.isoAlpha2
      ? `?country=${country.isoAlpha2}&productPage=true`
      : "?productPage=true";
    navigate(
      `${navigationRoutes.settings}/${navigationRoutes.countries}${countryQuery}`
    );
  };

  return (
    <>
      <SearchContainer>
        <InputContainer>
          <StyledInputBase
            placeholder={t("main.searchProducts")}
            onChange={handleSearchChange}
            inputProps={{ "aria-label": "search products" }}
            disabled={disabled}
          />
          <StyledIconButton aria-label="search">
            <SearchIcon />
          </StyledIconButton>
        </InputContainer>
        <StyledCountryDiv onClick={handleCountryRedirect}>
          {country?.flagUrl && (
            <Tooltip title={country.name}>
              <img
                src={country.flagUrl}
                alt={country.isoAlpha2}
                width={20}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          )}
          <CaretDown
            size="18px"
            style={{
              paddingLeft: 5,
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          />
        </StyledCountryDiv>
      </SearchContainer>
    </>
  );
};
