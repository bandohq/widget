import { Language } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardButton } from "../../components/Card/CardButton";
import { CardValue } from "../../components/Card/CardButton.style";
import { useLanguages } from "../../hooks/useLanguages";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { navigationRoutes } from "../../utils/navigationRoutes";

export const LanguageSetting: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenUI } = useWidgetConfig();
  const { selectedLanguageDisplayName } = useLanguages();

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.languages);
  };

  return (
    <CardButton
      onClick={handleClick}
      icon={<Language />}
      title={t("language.title")}
    >
      <CardValue>{selectedLanguageDisplayName}</CardValue>
    </CardButton>
  );
};
