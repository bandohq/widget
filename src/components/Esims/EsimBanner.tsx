import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const EsimBanner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 1,
        borderRadius: 1,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(65deg, #04534E 0%, #1A1A1A 80%);"
            : "linear-gradient(65deg, rgba(247,251,252,1) 0%,rgba(220,244,235,0.8) 40%,rgba(64,180,148,0.5) 100%);",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: "#fff",
        }}
      >
        Esim
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate("/esims")}
      >
        Learn more
      </Button>
    </Box>
  );
};
