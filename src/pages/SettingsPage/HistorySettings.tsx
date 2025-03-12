import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardButton } from "../../components/Card/CardButton";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { ClockCounterClockwise } from "@phosphor-icons/react";

export const HistorySettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenUI } = useWidgetConfig();

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.transactionHistory);
  };

  return (
    <CardButton
      onClick={handleClick}
      icon={<ClockCounterClockwise size={32} />}
      title={t("history.title")}
    />
  );
};
