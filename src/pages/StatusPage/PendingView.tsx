import { useTranslation } from "react-i18next";
import { palette } from "../../themes/palettes";
import {
  AnimatedCircularProgress,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { SpinnerGap } from "@phosphor-icons/react";

export const PendingView = () => {
  const { t } = useTranslation();
  return (
    <>
      <AnimatedCircularProgress>
        <SpinnerGap size={50} color={palette.primary.main} />
      </AnimatedCircularProgress>
      <StatusTitle style={{ margin: "10px 0" }}>
        {t("pending.title.procesing")}
      </StatusTitle>
      <StatusSubtitle>{t("pending.title.wait")}</StatusSubtitle>
    </>
  );
};
