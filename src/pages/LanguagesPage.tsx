import { Check } from "@mui/icons-material";
import { List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ListItemText } from "../components/ListItemText";
import { PageContainer } from "../components/PageContainer";
import { SettingsListItemButton } from "../components/SettingsListItemButton";
import { useHeader } from "../hooks/useHeader";
import { useLanguages } from "../hooks/useLanguages";

export const LanguagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { selectedLanguageCode, availableLanguages, setLanguageWithCode } =
    useLanguages();

  useHeader(t("language.title"));

  if (availableLanguages.length < 1) {
    return null;
  }

  return (
    <PageContainer disableGutters isDrawer>
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {availableLanguages.map((language) => (
          <SettingsListItemButton
            key={language}
            onClick={() => setLanguageWithCode(language)}
          >
            <ListItemText primary={t("language.name", { lng: language })} />
            {selectedLanguageCode === language && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
