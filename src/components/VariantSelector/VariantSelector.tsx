import { BottomSheet } from "../BottomSheet/BottomSheet.js";
import { DialogList } from "../DialogList/DialogList.js";
import { VariantItem } from "../DialogList/VariantItem.js";
import VariantSlider from "../VariantSlider/VariantSlider.js";

interface VariantSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: {
    brandName?: string;
    imageUrl?: string;
    variants: Array<{
      productType: string;
      price: { fiatValue: string };
    }>;
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

  return (
    <BottomSheet open={open} onClose={onClose}>
      {(selectedBrand.variants.length > 1 &&
        selectedBrand.variants[0].productType === "topup") ||
      selectedBrand.variants[0].productType === "esim" ? (
        <VariantSlider
          onClose={onClose}
          title={selectedBrand.brandName || ""}
          variants={[...selectedBrand.variants].sort(
            (a, b) =>
              parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
          )}
        />
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
