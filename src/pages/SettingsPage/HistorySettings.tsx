import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardButton } from "../../components/Card/CardButton";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { useAccount } from "@lifi/wallet-management";
import { CardValue } from "../../components/Card/CardButton.style";

export const HistorySettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenUI } = useWidgetConfig();
  const { account } = useAccount();

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null;
  }

  const handleClick = () => {
    if (!account.address) return;
    navigate(navigationRoutes.transactionHistory);
  };

  return (
    <CardButton
      onClick={handleClick}
      icon={<ClockCounterClockwise size={32} />}
      title={t("history.title")}
    >
      {!account.address && (
        <CardValue sx={{ fontSize: "14px" }}>
          {t("button.connectWallet")}
        </CardValue>
      )}
    </CardButton>
  );
};
