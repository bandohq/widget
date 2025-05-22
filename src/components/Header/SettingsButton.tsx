import { Settings } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigateBack } from "../../hooks/useNavigateBack.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { SettingsIconButton } from "./SettingsButton.style.js";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface NavigationButtonProps {
  icon: ReactNode;
  route: string;
  tooltipKey: string;
}

export const NavigationButton = ({
  icon,
  route,
  tooltipKey,
}: NavigationButtonProps) => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  const tooltipMessage = t(tooltipKey);

  return (
    <Tooltip title={tooltipMessage}>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(route)}
        variant={"info"}
      >
        {icon}
      </SettingsIconButton>
    </Tooltip>
  );
};

//
export const SettingsButton = () => {
  return (
    <NavigationButton
      icon={<Settings />}
      route={navigationRoutes.settings}
      tooltipKey="header.settings"
    />
  );
};

export const HistoryButton = () => {
  return (
    <NavigationButton
      icon={<ClockCounterClockwise />}
      route={navigationRoutes.transactionHistory}
      tooltipKey="history.title"
    />
  );
};
