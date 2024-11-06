import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { LanguageSetting } from "./LanguageSetting";
import { ResetSettingsButton } from "./ResetSettingsButton";
import { SettingsList } from "./SettingsCard/SettingCard.style";
import { SettingsCardAccordion } from "./SettingsCard/SettingsAccordian";
import { ThemeSettings } from "./ThemeSettings";

export const SettingsPage = () => {
  const { t } = useTranslation();
  useHeader(t("header.settings"));

  return (
    <PageContainer bottomGutters>
      <SettingsList>
        <SettingsCardAccordion>
          <ThemeSettings />
          <LanguageSetting />
        </SettingsCardAccordion>
      </SettingsList>
      <ResetSettingsButton />
    </PageContainer>
  );
};
