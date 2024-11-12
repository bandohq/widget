import { Public } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardButton } from "../../components/Card/CardButton";
import { CardValue } from "../../components/Card/CardButton.style";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { navigationRoutes } from "../../utils/navigationRoutes";

export const CountriesSetting: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenUI } = useWidgetConfig();

  if (hiddenUI?.includes(HiddenUI.countries)) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.countries);
  };

  return (
    <CardButton
      onClick={handleClick}
      icon={<Public />}
      title={t("countries.title")}
    >
      <CardValue>{t("countries.title")}</CardValue>
    </CardButton>
  );
};
