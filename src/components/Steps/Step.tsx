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

const StepIcon = (type: string) => {
  const theme = useTheme();
  return type === "info" ? (
    <Info size={32} />
  ) : type === "loading" ? (
    <AnimatedCircularProgress>
      <SpinnerGap size={25} />
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
        <ListItemText primary={t(step?.message)} />
      </ListItem>
    </Collapse>
  );
};
