import { Input } from "../../components/ReferenceInput/Input";
import { Typography } from "@mui/material";
import { palette } from "../../themes/palettes";

interface DetailSectionProps {
  productType: string;
  referenceType: string;
}
export const DetailSection: React.FC<DetailSectionProps> = ({
  productType,
  referenceType,
}) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <Typography variant="subtitle1" style={{ color: palette.grey[400] }}>
        Details
      </Typography>
      <Input formType="to" referenceType={referenceType} />
      <Typography variant="subtitle2" style={{ color: palette.grey[400] }}>
        Is where you will recibe your {productType}.
      </Typography>
    </div>
  );
};
