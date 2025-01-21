import { List, ListItemIcon, Avatar, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useState } from "react";
import { SearchBar } from "../components/SearchInput/SearchInput";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    removeCountry,
    restoreCountry,
    blockedCountries,
    availableCountries,
    isCountryPending,
  } = useCountryContext();
  const [searchQuery, setSearchQuery] = useState("");

  useHeader(t("countries.title"));

  const filteredBlockedCountries = blockedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableCountries = availableCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCountryPending) {
    return <div>Loading...</div>;
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
        {/* Blocked countries */}
        {filteredBlockedCountries.map((country) => (
          <SettingsListItemButton
            key={country.iso_alpha2}
            onClick={() => {
              restoreCountry(country.iso_alpha2);
            }}
          >
            <ListItemIcon>
              <Avatar
                src={country.flag_url}
                alt={country.name}
                sx={{ objectFit: "cover" }}
              />
            </ListItemIcon>
            <ListItemText primary={`${country.name} - ${country.iso_alpha2}`} />
            <Chip
              color="error"
              label={t("countries.excluded")}
              variant="outlined"
              size="small"
            />
          </SettingsListItemButton>
        ))}

        {/* Available countries */}
        {filteredAvailableCountries.map((country) => (
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
            <ListItemText primary={`${country.name} - ${country.iso_alpha2}`} />
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
