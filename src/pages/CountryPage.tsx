import { List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useFetch } from "../hooks/useFetch";

export const CountryPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: countries,
    error,
    isPending,
  } = useFetch({
    url: "/country",
  });

  useHeader(t("header.title"));

  if (isPending || error || countries.length < 1) {
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
        {countries.map((country) => (
          <SettingsListItemButton
            key={country}
            onClick={() => setCountriesWithCode()}
          >
            <ListItemText primary={t("language.name")} />
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
