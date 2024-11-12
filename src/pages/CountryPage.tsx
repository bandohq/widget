import { List, ListItemIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useFetch } from "../hooks/useFetch";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: countriesResponse,
    error,
    isPending,
  } = useFetch({
    url: "countries",
  });

  useHeader(t("header.title"));

  if (isPending || error) {
    return null;
  }

  const setCountriesWithCode = () => {};

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
              key={country}
              onClick={() => setCountriesWithCode()}
            >
              <ListItemIcon>
                <img src={country.flag_url} alt={country.name} width={30} />
              </ListItemIcon>
              <ListItemText
                primary={`${country.name} - ${country.iso_alpha2}`}
              />
            </SettingsListItemButton>
          ))}
      </List>
    </PageContainer>
  );
};
