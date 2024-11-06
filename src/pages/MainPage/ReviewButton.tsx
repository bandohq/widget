import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BaseTransactionButton } from "../../components/BaseTransactionButton/BaseTransactionButton";
import { useRoutes } from "../../hooks/useRoutes.js";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useSplitSubvariantStore } from "../../stores/settings/useSplitSubvariantStore";
import { navigationRoutes } from "../../utils/navigationRoutes.js";

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subvariant, subvariantOptions } = useWidgetConfig();
  const splitState = useSplitSubvariantStore((state) => state.state);
  const { routes, setReviewableRoute } = useRoutes();

  const currentRoute = routes?.[0];

  const handleClick = async () => {
    if (currentRoute) {
      setReviewableRoute(currentRoute);
      navigate(navigationRoutes.transactionExecution, {
        state: { routeId: currentRoute.id },
      });
    }
  };

  const getButtonText = (): string => {
    if (currentRoute) {
      switch (subvariant) {
        case "custom":
          return t(`button.${subvariantOptions?.custom ?? "checkout"}Review`);
        case "refuel":
          return t("button.getGas");
        default: {
          const transactionType =
            currentRoute.fromChainId === currentRoute.toChainId
              ? "swap"
              : "bridge";
          return t(`button.${transactionType}Review`);
        }
      }
    }
    switch (subvariant) {
      case "custom":
        return subvariantOptions?.custom === "deposit"
          ? t("button.deposit")
          : t("button.buy");
      case "refuel":
        return t("button.getGas");
      case "split":
        if (splitState) {
          return t(`button.${splitState}`);
        }
        return t("button.exchange");
      default:
        return t("button.exchange");
    }
  };

  return <BaseTransactionButton text={getButtonText()} onClick={handleClick} />;
};
