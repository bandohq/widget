import { useNavigate } from "react-router-dom";
import { Variant } from "../../stores/ProductProvider/types.js";
import { BottomSheet } from "../BottomSheet/BottomSheet.js";
import { DialogList } from "../DialogList/DialogList.js";
import { StyledItem } from "../DialogList/DialogList.styles.js";
import { VariantItem } from "../DialogList/VariantItem.js";
import VariantSlider from "../VariantSlider/VariantSlider.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider.js";

interface VariantSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: {
    brandName?: string;
    imageUrl?: string;
    variants: Variant[];
  } | null;
  onVariantSelect: (item: any) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  open,
  onClose,
  selectedBrand,
  onVariantSelect,
}) => {
  if (!selectedBrand) return null;
  const navigate = useNavigate();
  const { updateBrand } = useProduct();

  const handleTopupClick = () => {
    updateBrand(selectedBrand);
    navigate(`/topup`);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      {selectedBrand.variants.length > 1 &&
      selectedBrand.variants[0].productType === "esim" ? (
        <VariantSlider
          onClose={onClose}
          title={selectedBrand.brandName || ""}
          variants={[...selectedBrand.variants].sort(
            (a, b) =>
              parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
          )}
        />
      ) : selectedBrand.variants[0].productType === "topup" ? (
        <StyledItem onClick={handleTopupClick}>hola</StyledItem>
      ) : (
        <DialogList
          type={selectedBrand?.variants[0].productType}
          items={[...selectedBrand.variants].sort(
            (a, b) =>
              parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
          )}
          onClose={onClose}
          title={selectedBrand.brandName || ""}
          image={selectedBrand.imageUrl || ""}
          renderItem={(item) => (
            <VariantItem item={item} onClose={() => onVariantSelect(item)} />
          )}
        />
      )}
    </BottomSheet>
  );
};
