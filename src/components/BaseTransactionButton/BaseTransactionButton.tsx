import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useChain } from "../../hooks/useChain";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import { useFieldValues } from "../../stores/form/useFieldValues";
import type { BaseTransactionButtonProps } from "./types.js";
import { AnimatedCircularProgress } from "../../pages/StatusPage/StatusPage.style";
import { SpinnerGap } from "@phosphor-icons/react";

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation();
  const { walletConfig } = useWidgetConfig();
  const { openWalletMenu } = useWalletMenu();
  const [fromChainId] = useFieldValues("fromChain");
  const { chain } = useChain(fromChainId);
  const { palette } = useTheme();
  const { account } = useAccount({ chainType: chain?.networkType });

  const handleClick = async () => {
    if (account.isConnected) {
      onClick?.();
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect();
    } else {
      openWalletMenu();
    }
  };

  const getButtonText = () => {
    if (loading) {
      return (
        <AnimatedCircularProgress size={24}>
          <SpinnerGap size={24} color={palette.primary.main} />
        </AnimatedCircularProgress>
      );
    }
    if (account.isConnected) {
      if (text) {
        return text;
      }
    }
    return t("button.connectWallet");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={account.isConnected && disabled}
      fullWidth
    >
      {getButtonText()}
    </Button>
  );
};
