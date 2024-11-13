import { List, ListItemIcon, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useFetch } from "../hooks/useFetch";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const { removeCountry } = useCountryContext();
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

  useHeader(t("language.title"));

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

  if (isPending || error) {
    return null;
  }

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {!isPending &&
          countriesResponse?.data?.results.map((country) => (
            <SettingsListItemButton
              key={country.iso_alpha2}
              onClick={() => {
                removeCountry(country.iso_alpha2);
                toggleMarkCountry(country.iso_alpha2);
              }}
            >
              <ListItemIcon>
                <img src={country.flag_url} alt={country.name} width={30} />
              </ListItemIcon>
              <ListItemText
                primary={`${country.name} - ${country.iso_alpha2}`}
              />
              {markedCountries.has(country.iso_alpha2) && (
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMarkCountry(country.iso_alpha2);
                  }}
                >
                  <CloseIcon color="error" />
                </IconButton>
              )}
            </SettingsListItemButton>
          ))}
      </List>
    </PageContainer>
  );
};
