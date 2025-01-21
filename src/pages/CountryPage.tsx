import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { List, ListItemIcon, Avatar, Chip } from "@mui/material";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { SearchBar } from "../components/SearchInput/SearchInput";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProductPage = searchParams.get("productPage");
  const {
    removeCountry,
    restoreCountry,
    selectCountry,
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
        {!isProductPage &&
          filteredBlockedCountries.map((country) => (
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
              <ListItemText
                primary={`${country.name} - ${country.iso_alpha2}`}
              />
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
              if (isProductPage) {
                selectCountry(country.iso_alpha2);
                navigate(-1);
              } else {
                removeCountry(country.iso_alpha2);
              }
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
