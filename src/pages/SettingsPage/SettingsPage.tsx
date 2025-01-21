import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { LanguageSetting } from "./LanguageSetting";
import { SettingsList } from "./SettingsCard/SettingCard.style";
import { SettingsCardAccordion } from "./SettingsCard/SettingsAccordian";
import { ThemeSettings } from "./ThemeSettings";
import { CardButton } from "../../components/Card/CardButton";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { Language } from "@mui/icons-material";
import { CardValue } from "../../components/Card/CardButton.style";
import { CountriesSetting } from "./CountriesSetting";

export const SettingsPage = () => {
  const { t } = useTranslation();
  useHeader(t("header.settings"));

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${navigationRoutes.status}`);
  };

  return (
    <PageContainer bottomGutters>
      <SettingsList>
        <SettingsCardAccordion>
          <ThemeSettings />
          <LanguageSetting />
          <CountriesSetting />
          <CardButton
            onClick={handleClick}
            icon={<Language />}
            title={"Status"}
          >
            <CardValue>page</CardValue>
          </CardButton>
        </SettingsCardAccordion>
      </SettingsList>
    </PageContainer>
  );
};
