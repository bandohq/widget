import { useNavigate } from "react-router-dom";
import { Variant } from "../../stores/ProductProvider/types.js";
import { BottomSheet } from "../BottomSheet/BottomSheet.js";
import { DialogList } from "../DialogList/DialogList.js";
import { StyledItem } from "../DialogList/DialogList.styles.js";
import { VariantItem } from "../DialogList/VariantItem.js";
import VariantSlider from "../VariantSlider/VariantSlider.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";

interface VariantSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: {
    brandName?: string;
    imageUrl?: string;
    variants: Variant[];
  } | null;
  onVariantSelect: (item: Variant) => void;
}

const sortByPrice = (variants: Variant[]) =>
  [...variants].sort(
    (a, b) => parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
  );

const renderTopupSubtypes = (
  variants: Variant[],
  onSubtypeClick: (subType: string) => void
) => {
  const uniqueSubTypes = Array.from(
    new Set(variants.map((variant) => variant.subTypes?.[0]))
  );

  return uniqueSubTypes.map((subType) => (
    <StyledItem key={subType} onClick={() => onSubtypeClick(subType!)}>
      {subType}
    </StyledItem>
  ));
};

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  open,
  onClose,
  selectedBrand,
  onVariantSelect,
}) => {
  const navigate = useNavigate();
  const { updateBrand } = useProduct();

  if (!selectedBrand) return null;

  const { brandName = "", imageUrl = "", variants } = selectedBrand;
  const sortedVariants = sortByPrice(variants);
  const productType = variants[0]?.productType;

  const handleTopupNavigation = (subType: string) => {
    updateBrand(selectedBrand);
    navigate(`${navigationRoutes.topup}?type=${subType}`);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      {productType === "esim" && variants.length > 1 ? (
        <VariantSlider
          onClose={onClose}
          title={brandName}
          variants={sortedVariants}
        />
      ) : productType === "topup" ? (
        <DialogList
          type={productType}
          items={Array.from(
            new Set(variants.map((variant) => variant.subTypes?.[0]))
          )}
          onClose={onClose}
          title={brandName}
          image={imageUrl}
          renderItem={(subType) => (
            <StyledItem onClick={() => handleTopupNavigation(subType)}>
              {subType}
            </StyledItem>
          )}
        />
      ) : (
        <DialogList
          type={productType}
          items={sortedVariants}
          onClose={onClose}
          title={brandName}
          image={imageUrl}
          renderItem={(item) => (
            <VariantItem item={item} onClose={() => onVariantSelect(item)} />
          )}
        />
      )}
    </BottomSheet>
  );
};
