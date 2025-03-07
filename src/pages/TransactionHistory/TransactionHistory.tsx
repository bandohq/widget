import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";

export const SettingsPage = () => {
  const { t } = useTranslation();
  useHeader(t("history.title"));
  const { account } = useAccount();
  return (
    <PageContainer bottomGutters>
      <h1>transactions</h1>
    </PageContainer>
  );
};
