import { CircularProgress } from "@mui/material";
import { StatusSubtitle, StatusTitle } from "./StatusPage.style";

export const PendingView = () => {
  return (
    <>
      <CircularProgress color="primary" size={50} />
      <StatusTitle style={{ margin: "10px 0" }}>
        Processing your order
      </StatusTitle>
      <StatusSubtitle>This process will be late a few minutes.</StatusSubtitle>
    </>
  );
};
