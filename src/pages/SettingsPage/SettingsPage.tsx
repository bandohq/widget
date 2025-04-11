import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { LanguageSetting } from "./LanguageSetting";
import { SettingsList } from "./SettingsCard/SettingCard.style";
import { SettingsCardAccordion } from "./SettingsCard/SettingsAccordian";
import { ThemeSettings } from "./ThemeSettings";
import { useAccount } from "@lifi/wallet-management";
import { Typography } from "@mui/material";
import { shortenAddress } from "../../utils/wallet";
import { HistorySettings } from "./HistorySettings";

export const SettingsPage = () => {
  const { t } = useTranslation();
  useHeader(t("header.settings"));
  const { account } = useAccount();
  return (
    <PageContainer bottomGutters>
      <SettingsList>
        <SettingsCardAccordion>
          <ThemeSettings />
          <LanguageSetting />
          <HistorySettings />
        </SettingsCardAccordion>
        {account.address && (
          <Typography sx={{ textAlign: "right", fontSize: "1px", mt: "20px" }}>
            Connected To {shortenAddress(account.address)}
          </Typography>
        )}
      </SettingsList>
    </PageContainer>
  );
};
