import { Typography, Divider } from "@mui/material";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { palette } from "../../themes/palettes";

export const VariantItem: React.FC<{ item: any; onClose?: () => void }> = ({
  item,
  onClose,
}) => {
  const { updateProduct } = useProduct();
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
        <Typography style={{ fontSize: "18px", color: palette.grey[400] }}>
          {data}
        </Typography>
        <Typography variant="body1" style={{ color: palette.grey[400] }}>
          {voice}
        </Typography>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={handleSelectProduct}
        style={{
          padding: "8px 10px",
          display: "flex",
          width: "90%",
          margin: "0 auto",
          borderRadius: "5px",
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
      <Divider />
    </>
  );
};
