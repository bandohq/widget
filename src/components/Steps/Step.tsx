import {
  Collapse,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from "@mui/material";
import { CheckCircle, Info, SpinnerGap } from "@phosphor-icons/react";
import { AnimatedCircularProgress } from "../../pages/StatusPage/StatusPage.style";
import { useTranslation } from "react-i18next";
import { useSteps } from "../../providers/StepsProvider/StepsProvider";

const StepIcon = (type: string) => {
  const theme = useTheme();
  return type === "info" ? (
    <Info size={32} fill={theme.palette.info.light} />
  ) : type === "loading" ? (
    <AnimatedCircularProgress>
      <SpinnerGap size={25} fill={theme.palette.primary.main} />
    </AnimatedCircularProgress>
  ) : (
    <CheckCircle size={32} fill={theme.palette.success.light} />
  );
};

export const Step = ({ step }) => {
  const { t } = useTranslation();
  return (
    <Collapse in={Boolean(step)}>
      <ListItem>
        <ListItemAvatar>{StepIcon(step?.type)}</ListItemAvatar>
        <ListItemText
          // @ts-ignore it returns a string, not an object
          primary={t(step?.message, { ...step?.variables })}
          secondary={step?.description && step?.description}
        />
      </ListItem>
    </Collapse>
  );
};

export const Steps = () => {
  const { steps } = useSteps();
  return (
    <>
      {steps.map((step, index) => (
        <Step key={index} step={step} />
      ))}
    </>
  );
};
