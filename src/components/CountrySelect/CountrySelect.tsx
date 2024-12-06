import { MenuItem, Tooltip } from "@mui/material";
import { StyledCountrySelect } from "./CountrySelect.style";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useEffect, useState } from "react";
import { Country } from "../../stores/CountriesProvider/types";

interface CountrySelectProps {
  countryGetter?: (country: Country) => void;
}

export const CountrySelect = ({ countryGetter }: CountrySelectProps) => {
  const { country, countries, selectCountry, getCountry } = useCountryContext();
  const [selectedCountry, setSelectedCountry] = useState(country);

  const handleSelectCountry = (isoCode: string) => {
    const country = getCountry(isoCode);
    if (countryGetter) {
      countryGetter(country);
    } else {
      selectCountry(isoCode);
    }
    setSelectedCountry(country);
  };

  useEffect(() => {
    setSelectedCountry(country);

    if (countryGetter) {
      countryGetter(country);
    }
  }, [country]);

  return (
    <StyledCountrySelect
      value={selectedCountry?.iso_alpha2}
      onChange={(e) => handleSelectCountry(e.target.value as string)}
      displayEmpty
      inputProps={{ "aria-label": "Country" }}
      renderValue={() => (
        <img
          src={selectedCountry?.flag_url}
          alt={selectedCountry?.iso_alpha2}
          width={20}
        />
      )}
    >
      {countries.map((country) => (
        <MenuItem key={country.iso_alpha2} value={country.iso_alpha2}>
          <Tooltip title={country.name}>
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
    </StyledCountrySelect>
  );
};
