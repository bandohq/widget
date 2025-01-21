import { Settings } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigateBack } from "../../hooks/useNavigateBack.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { SettingsIconButton } from "./SettingsButton.style.js";

export const SettingsButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  const tooltipMessage = t("header.settings");

  return (
    <Tooltip title={tooltipMessage}>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(navigationRoutes.settings)}
        variant={"info"}
      >
        <Settings />
      </SettingsIconButton>
    </Tooltip>
  );
};
