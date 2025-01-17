import { List, ListItemIcon, IconButton, Avatar, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useFetch } from "../hooks/useFetch";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchInput/SearchInput";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const { removeCountry, filteredCountries: deactivatedCountries } =
    useCountryContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [markedCountries, setMarkedCountries] = useState<Set<string>>(
    new Set()
  );

  const {
    data: countriesResponse,
    error,
    isPending,
  } = useFetch({
    url: "countries",
  });

  useHeader(t("countries.title"));

  useEffect(() => {}, [countriesResponse, deactivatedCountries]);

  const toggleMarkCountry = (isoCode: string) => {
    setMarkedCountries((prev) => {
      const updated = new Set(prev);
      if (updated.has(isoCode)) {
        updated.delete(isoCode);
      } else {
        updated.add(isoCode);
      }
      return updated;
    });
  };

  const filteredCountries = countriesResponse?.data?.results.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending || error) {
    return null;
  }

  return (
    <PageContainer disableGutters>
      <SearchBar onSearch={setSearchQuery} />
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {!isPending &&
          filteredCountries.map((country) => (
            <SettingsListItemButton
              key={country.iso_alpha2}
              onClick={() => {
                removeCountry(country.iso_alpha2);
                toggleMarkCountry(country.iso_alpha2);
              }}
            >
              <ListItemIcon>
                <Avatar
                  src={country.flag_url}
                  alt={country.name}
                  sx={{ objectFit: "cover" }}
                />
              </ListItemIcon>
              <ListItemText
                primary={`${country.name} - ${country.iso_alpha2}`}
              />
              {markedCountries.has(country.iso_alpha2) && (
                <Chip
                  color="error"
                  label="EXCLUDED"
                  variant="outlined"
                  size="small"
                />
              )}
            </SettingsListItemButton>
          ))}
      </List>
    </PageContainer>
  );
};
