import { CloseRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrawer } from "../../AppDrawerContext";
import { useExternalWalletProvider } from "../../providers/WalletProvider/useExternalWalletProvider.js";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";

interface CloseDrawerButtonProps {
  header?: "navigation" | "wallet";
}

export const CloseDrawerButton = ({ header }: CloseDrawerButtonProps) => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const { closeDrawer } = useDrawer();
  const { useExternalWalletProvidersOnly: hasExternalProvider } =
    useExternalWalletProvider();

  const showInNavigationHeader =
    header === "navigation" && (hasExternalProvider || subvariant === "split");

  const showInWalletHeader = header === "wallet" && subvariant !== "split";

  return showInNavigationHeader || showInWalletHeader ? (
    <Tooltip title={t("button.close")}>
      <IconButton size="medium" onClick={closeDrawer}>
        <CloseRounded />
      </IconButton>
    </Tooltip>
  ) : null;
};
