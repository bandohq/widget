import { List, ListItemIcon, IconButton, Avatar, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useFetch } from "../hooks/useFetch";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useState } from "react";
import { SearchBar } from "../components/SearchInput/SearchInput";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const { removeCountry, filteredCountries: deactivated } = useCountryContext();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: countriesResponse,
    error,
    isPending,
  } = useFetch({
    url: "countries",
  });

  useHeader(t("countries.title"));

  const filteredCountries = countriesResponse?.data?.results
    .filter((country) =>
      deactivated.every((c) => c.iso_alpha2 !== country.iso_alpha2)
    )
    .unshift(...deactivated);

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
              {/* {markedCountries.has(country.iso_alpha2) && (
                <Chip
                  color="error"
                  label="EXCLUDED"
                  variant="outlined"
                  size="small"
                />
              )} */}
            </SettingsListItemButton>
          ))}
      </List>
    </PageContainer>
  );
};
