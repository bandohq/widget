import { useTranslation } from "react-i18next";
import {
  NotFoundContainer,
  NotFoundIconContainer,
  NotFoundMessage,
} from "../../components/Search/SearchNotFound.style";

export const NoTrasactionsFound = () => {
  const { t } = useTranslation();
  return (
    <NotFoundContainer>
      <img
        src="/travolta.png"
        alt="no transactions"
        style={{ width: "50%", margin: "0 auto" }}
      />
      <NotFoundMessage>{t("history.noTransactions")}</NotFoundMessage>
    </NotFoundContainer>
  );
};
