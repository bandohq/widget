import { Box, Tooltip, Typography } from "@mui/material";
import { version } from "../../config/versions";
import { Link } from "./PoweredBy.style.js";

export const PoweredBy: React.FC = () => {
  return (
    <Box
      pt={1}
      pb={2}
      flex={1}
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <Tooltip title={`v${version}`} enterDelay={1000}>
        <Link
          href="https://bando.cool"
          target="_blank"
          underline="none"
          color="text.primary"
        >
          <Typography
            color="text.secondary"
            fontSize={12}
            fontWeight={500}
            px={0.5}
          >
            Powered by
          </Typography>
          <Typography color="text.primary" fontSize={12} fontWeight={600}>
            Bando
          </Typography>
        </Link>
      </Tooltip>
    </Box>
  );
};
