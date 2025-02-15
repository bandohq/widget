import { Collapse } from "@mui/material";
import { Container } from "./Steps.styles";
import { useSteps } from "../../providers/StepsProvider/StepsProvider";
import { Info, SpinnerGap } from "@phosphor-icons/react";
import { AnimatedCircularProgress } from "../../pages/StatusPage/StatusPage.style";

const StepIcon = (type: string) => {
  return type === "info" ? (
    <Info size={32} />
  ) : (
    <AnimatedCircularProgress>
      <SpinnerGap size={25} />
    </AnimatedCircularProgress>
  );
};

export const Steps = () => {
  const { showSteps, step } = useSteps();

  return (
    <Collapse in={showSteps}>
      <Container bgcolor={step?.type}>
        {StepIcon(step?.type)} {step?.message}
      </Container>{" "}
    </Collapse>
  );
};
