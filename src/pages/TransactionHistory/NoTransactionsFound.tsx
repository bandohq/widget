import { useTranslation } from "react-i18next";
import {
  NotFoundContainer,
  NotFoundMessage,
} from "../../components/Search/SearchNotFound.style";
import { NotFound } from "../../assets/NotFound";

export const NoTransactionsFound = () => {
  const { t } = useTranslation();
  return (
    <NotFoundContainer>
      <img
        src={NotFound}
        alt="no transactions"
        style={{ width: "50%", margin: "0 auto" }}
      />
      <NotFoundMessage>{t("history.noTransactions")}</NotFoundMessage>
    </NotFoundContainer>
  );
};
