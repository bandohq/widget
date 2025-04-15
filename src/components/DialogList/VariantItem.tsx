import { alpha, Typography, useTheme } from "@mui/material";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { StyledItem } from "./DialogList.styles";

export const VariantItem: React.FC<{ item: any; onClose?: () => void }> = ({
  item,
  onClose,
}) => {
  const { updateProduct } = useProduct();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSelectProduct = () => {
    updateProduct(item);
    onClose();
    navigate(`/form`);
  };

  const ItemData = () => {
    const data = item.dataUnlimited
      ? "Unlimited GB"
      : item.dataGB
      ? item.dataGB
      : "No GB";

    const voice = item.voiceUnlimited
      ? "Unlimited voice"
      : item.voiceMinutes
      ? item.voiceMinutes
      : "No voice";
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography style={{ fontSize: "18px" }}>{data}</Typography>
        <Typography variant="body1">{voice}</Typography>
      </div>
    );
  };

  return (
    <>
      <StyledItem>
        <Typography style={{ fontSize: "18px" }}>
          {parseFloat(item.price.fiatValue).toFixed(2)}{" "}
          {item.price.fiatCurrency}
        </Typography>
        {item.productType === "topup" && ItemData()}
      </StyledItem>
    </>
  );
};
