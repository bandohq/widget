import type { MouseEventHandler, PropsWithChildren } from "react";
import type { SettingCardTitle } from "../../pages/SettingsPage/SettingsCard/types";
import { Card } from "./Card";
import {
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from "./CardButton.style";

interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
}

export const CardButton: React.FC<PropsWithChildren<SettingCardButtonProps>> = ({
  onClick,
  icon,
  title,
  children,
}) => (
  <Card>
    <CardRowButton onClick={onClick} disableRipple>
      <CardTitleContainer>
        {icon}
        <CardValue sx={{ textAlign: "start" }}>{title}</CardValue>
      </CardTitleContainer>
      {children}
    </CardRowButton>
  </Card>
);
