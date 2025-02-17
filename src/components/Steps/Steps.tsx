import { useSteps } from "../../providers/StepsProvider/StepsProvider";
import { Step } from "./Step";

export const Steps = () => {
  const { steps } = useSteps();
  return (
    <>
      {steps?.map((step, index) => (
        <Step key={index} step={step} />
      ))}
    </>
  );
};
