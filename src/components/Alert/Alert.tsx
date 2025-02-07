import { Box, Collapse, Typography } from "@mui/material";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";
import { palette } from "../../themes/palettes";
import { useEffect, useState } from "react";

export const Alert = () => {
  const { notification, hideNotification } = useNotificationContext();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (notification) {
      setShowNotification(true);

      if (!notification.persistent) {
        const timer = setTimeout(() => {
          setShowNotification(false);
          hideNotification();
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [notification, hideNotification]);

  return (
    <Collapse in={showNotification}>
      <Box
        sx={{
          bgcolor: palette[notification?.type]?.main || "transparent",
          width: "100%",
          p: 2,
          borderRadius: "0 0 25px 25px",
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
