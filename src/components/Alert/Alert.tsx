import { Box, Collapse, Typography } from "@mui/material";
import { useNotificationContext } from "../../providers/AlertProvider/AlertProvider";
import { palette } from "../../themes/palettes";
import { useEffect, useState } from "react";

export const Alert = () => {
  const { notification } = useNotificationContext();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Collapse in={showNotification}>
      <Box
        sx={{
          bgcolor: palette[notification?.type]?.main || "transparent",
          width: "100%",
          p: 2,
        }}
      >
        <Typography
          color={notification?.type === "warning" ? "black" : "white"}
          align="center"
          variant="body1"
        >
          {notification?.message}
        </Typography>
      </Box>
    </Collapse>
  );
};
