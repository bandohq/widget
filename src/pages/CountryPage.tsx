import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItemIcon,
  Avatar,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
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
    selectCountry,
    blockedCountries,
    availableCountries,
    isCountryPending,
    error,
    hasCountries,
  } = useCountryContext();
  const [searchQuery, setSearchQuery] = useState("");

  useHeader(t("countries.title"));

  const filteredBlockedCountries = blockedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableCountries = availableCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state or error
  if (isCountryPending || error) {
    return (
      <PageContainer disableGutters>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 4,
            px: 2,
          }}
        >
          {Array.from(new Array(10)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={45}
              sx={{ marginBottom: 1, borderRadius: "5px" }}
            />
          ))}
        </Box>
      </PageContainer>
    );
  }

  if (!hasCountries) {
    return (
      <PageContainer disableGutters isDrawer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 4,
            px: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("error.title.countriesUnavailable")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("error.message.noCountriesAvailable")}
          </Typography>
        </Box>
      </PageContainer>
    );
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
        {filteredAvailableCountries.map((country) => (
          <SettingsListItemButton
            key={country.isoAlpha2}
            onClick={() => {
              if (isProductPage) {
                selectCountry(country.isoAlpha2);
                navigate(-1);
              } else {
                removeCountry(country.isoAlpha2);
              }
            }}
          >
            <ListItemIcon>
              <Avatar
                src={country.flagUrl}
                alt={country.name}
                sx={{ objectFit: "cover" }}
              />
            </ListItemIcon>
            <ListItemText primary={country.name} />
          </SettingsListItemButton>
        ))}

        {/* No search results */}
        {searchQuery &&
          filteredAvailableCountries.length === 0 &&
          filteredBlockedCountries.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {t("tooltip.notFound.text")}
              </Typography>
            </Box>
          )}
      </List>
    </PageContainer>
  );
};
