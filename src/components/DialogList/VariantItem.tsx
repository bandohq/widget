import { alpha, Typography, useTheme } from "@mui/material";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";

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
      <div
        onClick={handleSelectProduct}
        style={{
          padding: "15px 10px",
          display: "flex",
          width: "90%",
          margin: "0 auto",
          borderRadius: "5px",
          backgroundColor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.common.black, 0.04)
              : alpha(theme.palette.common.white, 0.08),
          alignItems: "center",
          justifyContent:
            item.productType === "topup" ? "space-between" : "center",
          cursor: "pointer",
        }}
      >
        <Typography style={{ fontSize: "18px" }}>
          {parseFloat(item.price.fiatValue).toFixed(2)}{" "}
          {item.price.fiatCurrency}
        </Typography>
        {item.productType === "topup" && ItemData()}
      </div>
    </>
  );
};
