import type { DialogProps, PaperProps, Theme } from "@mui/material";
import { Dialog as MuiDialog, Slide } from "@mui/material";
import { forwardRef, type PropsWithChildren } from "react";
import { useGetScrollableContainer } from "../hooks/useScrollableContainer";
import { TransitionProps } from "@mui/material/transitions";

export const modalProps = {
  sx: {
    position: "absolute",
    overflow: "hidden",
  },
};

export const paperProps: Partial<PaperProps> = {
  sx: (theme: Theme) => ({
    position: "absolute",
    backgroundImage: "none",
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  }),
};

export const slotProps = {
  backdrop: {
    sx: {
      position: "absolute",
      backgroundColor: "rgb(0 0 0 / 32%)",
      backdropFilter: "blur(3px)",
    },
  },
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  children,
  open,
  onClose,
}) => {
  const getContainer = useGetScrollableContainer();
  return (
    <MuiDialog
      container={getContainer}
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={modalProps.sx}
      PaperProps={paperProps}
      slotProps={slotProps}
    >
      {children}
    </MuiDialog>
  );
};
