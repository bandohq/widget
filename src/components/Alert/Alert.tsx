import { Box, Collapse } from "@mui/material";
import { useNotificationContext } from "../../providers/AlertProvider/AlertProvider";
import { palette } from "../../themes/palettes";

export const Alert = () => {
  const { notification } = useNotificationContext();
  return (
    <div>
      {notification && (
        <Collapse in={notification !== null}>
          <Box
            sx={{
              bgcolor: palette[notification?.type].main,
              width: "100%",
              p: 2,
            }}
          >
            {notification?.message}
          </Box>
        </Collapse>
      )}
    </div>
  );
};
