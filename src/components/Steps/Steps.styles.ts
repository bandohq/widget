import { Box, styled } from "@mui/material";

export const Container = styled(Box)(({ theme, bgcolor }) => {
    const backgroundColor = bgcolor === "info" ? theme.palette.info.light : bgcolor === "loading" ? theme.palette.action.selected : "white"
    return {
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
        width: "100%",
        margin: "0 auto 10px auto",
        padding: theme.spacing(2),
        gap: theme.spacing(2),
        backgroundColor,
        borderRadius: theme.shape.borderRadius,
        border: 'none',
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    }
});