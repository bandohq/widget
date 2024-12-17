import { Typography, Divider } from "@mui/material";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";

export const VariantItem: React.FC<{ item: any; onClose?: () => void }> = ({
  item,
  onClose,
}) => {
  const { updateProduct } = useProduct();
  const navigate = useNavigate();

  const handleSelectProduct = () => {
    updateProduct(item);
    onClose();
    navigate(`/`);
  };

  return (
    <>
      <div
        onClick={handleSelectProduct}
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Typography variant="body1">
          {parseFloat(item.price.fiatValue).toFixed(2)}{" "}
          {item.price.fiatCurrency}
        </Typography>
      </div>
      <Divider variant="middle" />
    </>
  );
};
