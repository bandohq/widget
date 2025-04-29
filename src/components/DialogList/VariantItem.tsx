import { Typography, useTheme } from "@mui/material";
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

  return (
    <div onClick={() => onClose && handleSelectProduct()}>
      <StyledItem>
        <Typography style={{ fontSize: "18px" }}>
          {parseFloat(item.price.fiatValue).toFixed(2)}{" "}
          {item.price.fiatCurrency}
        </Typography>
      </StyledItem>
    </div>
  );
};
