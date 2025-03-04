import { Collapse } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { useId } from "react";
import { Card } from "../../../components/Card/Card";
import {
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from "../../../components/Card/CardButton.style";
import { useSettingsCardExpandable } from "./SettingsAccordian";
import type { SettingCardTitle } from "./types";

interface SettingCardExpandableProps extends SettingCardTitle {
  value: ReactNode;
}

export const SettingCardExpandable: React.FC<
  PropsWithChildren<SettingCardExpandableProps>
> = ({ icon, title, value, children }) => {
  const { expanded, toggleExpanded } = useSettingsCardExpandable();
  const buttonId = useId();
  const collapseId = useId();

  return (
    <Card sx={{ p: 1 }}>
      <CardRowButton
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={toggleExpanded}
        disableRipple
        sx={{ p: 1 }}
      >
        <CardTitleContainer>
          {icon}
          <CardValue>{title}</CardValue>
        </CardTitleContainer>
        {!expanded && value}
      </CardRowButton>
      <Collapse
        id={collapseId}
        // biome-ignore lint/a11y/useSemanticElements:
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
      >
        {children}
      </Collapse>
    </Card>
  );
};
