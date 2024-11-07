import { palette } from "../../themes/palettes";
import {
  AnimatedCircularProgress,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { SpinnerGap } from "@phosphor-icons/react";

export const PendingView = () => {
  return (
    <>
      <AnimatedCircularProgress>
        <SpinnerGap size={50} color={palette.primary.main} />
      </AnimatedCircularProgress>
      <StatusTitle style={{ margin: "10px 0" }}>
        Processing your order
      </StatusTitle>
      <StatusSubtitle>This process will be late a few minutes.</StatusSubtitle>
    </>
  );
};
